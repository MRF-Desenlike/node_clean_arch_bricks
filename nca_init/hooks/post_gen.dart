import 'package:mason/mason.dart';
import '../../utils/run_command_service.dart';

Future<void> run(HookContext context) async {
  final service = RunCommandService(context: context);
  await service.runCommand(
      text: 'Upgrading package.json with latest dependency versions',
      command: "npx",
      args: [
        "npm-check-updates",
        "-u",
      ]);
  await service.runCommand(
      text: 'Installing updated dependencies',
      command: "npm",
      args: [
        "install",
      ]);
}
