import 'dart:convert';
import 'dart:io';
import 'package:mason/mason.dart';
import 'package:yaml/yaml.dart';

class RunCommandService {
  final HookContext context;
  late Map<String, dynamic> package;
  late String packagePath;
  late String packageText;
  late File packageJson;
  late bool hasPrisma;

  RunCommandService({required this.context}) {
    hasPrisma = context.vars['database'] != 'none';
    packagePath = (context.vars['name'] as String).toLowerCase();
  }

  Future<void> createProject() async {
    await runCommand(
      text: 'Creating NodeJS project',
      command: 'npm',
      args: ['init', '-y'],
    );
  }

  Future<void> installDependencies() async {
    // Install Packages
    await installPackages(
      dependencies: [
        "@fastify/cors",
        "@fastify/jwt",
        "@fastify/swagger",
        "@fastify/swagger-ui",
        "bcryptjs",
        "bullmq",
        "date-fns",
        "dotenv",
        "fastify",
        "handlebars",
        "ioredis",
        "lodash",
        "nodemailer",
        "pino-pretty",
        "validation-br",
        "zod",
        "zod-to-json-schema",
      ],
      isDev: false,
    );

    await installPackages(
      dependencies: [
        "@types/bcryptjs",
        "@types/jsonwebtoken",
        "@types/lodash",
        "@types/node",
        "@types/nodemailer",
        "concurrently",
        "tsup",
        "tsx",
        "typescript",
      ],
      isDev: true,
    );

    if (!hasPrisma) {
      return;
    }

    await runCommand(
      text: 'Integrating Prisma...',
      command: 'npx',
      args: ['--yes', 'prisma', 'generate'],
    );
  }

  void loadPackageContent() {
    final packageText = packageJson.readAsStringSync();
    package = jsonDecode(packageText);
  }

  Future<void> start() async {
    packageJson = File('package.json');
    if (!packageJson.existsSync()) {
      context.logger.info('Creating NodeJS project');
      await createProject();
    }

    loadPackageContent();

    await installDependencies();

    // Load package again
    loadPackageContent();

    // Scripts
    final isNewScripts = addScripts();

    // Prisma definitions
    final isNewPrisma = addPrisma();

    if (isNewScripts || isNewPrisma) {
      await savePackageContent();
    }

    // Initialize git
    await initializeGit();
  }

  Future<void> initializeGit() async {
    if (File('.git/config').existsSync()) {
      return;
    }
    await runCommand(
      text: 'Initialize git',
      command: 'git',
      args: ['init', '-b', 'main'],
    );
  }

  Future<void> installPrisma() async {
    await runCommand(
      text: 'Integrating Prisma...',
      command: 'npx',
      args: ['--yes', 'prisma', 'generate'],
    );
  }

  bool addScripts() {
    if (package['scripts'] != null && package['scripts']['start'] != null) {
      return false;
    }

    package['scripts'] = {
      "dev": "tsx --watch src/index.ts",
      "build": "tsc --noEmit && tsup",
      "dev:queue": "tsx --watch src/queue.ts",
      "dev:all": "concurrently --kill-others 'npm run dev' 'npm run dev:queue'",
      "start": "NODE_ENV=production node dist/index.js",
      "start:queue": "NODE_ENV=production node dist/queue.js",
      if (hasPrisma) ...{
        "db:migrate": "npx --yes prisma migrate dev --name migration",
        "db:migrate:prod":
            "NODE_ENV=production npx --yes prisma migrate deploy && node build/database/seed.js",
        "db:seed": "npx --yes prisma db seed",
      },
    };

    return true;
  }

  bool addPrisma() {
    if (!hasPrisma || package['prisma'] != null) {
      return false;
    }

    package['prisma'] = {
      "schema": "prisma",
      "seed": "tsx src/database/seed.ts",
    };

    return true;
  }

  Future<void> savePackageContent() async {
    final encoder = JsonEncoder.withIndent('  ');
    packageJson.writeAsStringSync(encoder.convert(package));
  }

  Future<bool> runCommand({
    required String command,
    required List<String> args,
    String? text,
  }) async {
    final result = await Process.run(command, args, runInShell: true);

    if (result.exitCode == 0) {
      context.logger.success('✅ ${text ?? command}');
    } else {
      context.logger.err('❌ ${text ?? command}: ${result.stdout}');
    }

    return result.exitCode == 0;
  }

  Future<bool> installPackages({
    required List<String> dependencies,
    required bool isDev,
  }) async {
    final dependencyNode = isDev ? 'devDependencies' : 'dependencies';
    final existingDependencies =
        ((package[dependencyNode] ?? {}) as Map<dynamic, dynamic>).keys
            .where((key) => key != null)
            .map((e) => e.toString());

    final missingPackages = dependencies.where(
      (p) => !existingDependencies.contains(p),
    );

    if (missingPackages.isEmpty) {
      return true;
    }

    final message =
        'Adding ${isDev ? 'dev' : ''} packages: ${missingPackages.join(', ')}';
    await runCommand(
      command: 'npm',
      text: message,
      args: ['install', ...missingPackages, if (isDev) '--save-dev'],
    );

    return true;
  }
}
