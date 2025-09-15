import 'dart:io';
import 'package:diacritic/diacritic.dart';
import 'package:mason/mason.dart';

void run(HookContext context) {
  final logger = context.logger;

  // ==== Nomes base do módulo ====
  final rawName = (context.vars['name'] ?? '').toString();
  context.vars['module_folder_name'] =
      removeDiacritics(rawName.toLowerCase().replaceAll(' ', '-'));
  context.vars['module_name'] = removeDiacritics(rawName);

  // ==== Helpers ====
  String ask(String label, {String? defaultValue}) {
    final suffix = defaultValue != null ? ' [$defaultValue]' : '';
    stdout.write('$label$suffix: ');
    final raw = stdin.readLineSync()?.trim() ?? '';
    if (raw.isEmpty && defaultValue != null) return defaultValue;
    return raw;
  }

  String askNonEmpty(String label) {
    var v = '';
    do {
      stdout.write('$label: ');
      v = stdin.readLineSync()?.trim() ?? '';
    } while (v.isEmpty);
    return v;
  }

  String askWithOptions(String label, List<String> options,
      {String? defaultValue}) {
    final opts = options.join('/');
    final suffix = defaultValue != null ? ' [$defaultValue]' : '';
    stdout.write('$label ($opts)$suffix: ');
    final raw = stdin.readLineSync()?.trim() ?? '';
    if (raw.isEmpty && defaultValue != null) return defaultValue;
    if (!options.contains(raw)) {
      logger.warn('Opção inválida. Usando ${defaultValue ?? options.first}.');
      return defaultValue ?? options.first;
    }
    return raw;
  }

  String tsType(String t) {
    switch (t) {
      case 'int':
      case 'float':
      case 'decimal':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'date':
      case 'datetime':
        return 'Date';
      case 'json':
        return 'Record<String, any>';
      case 'uuid':
      case 'string':
      default:
        return 'string';
    }
  }

  String prismaType(String t) {
    switch (t) {
      case 'int':
        return 'Int';
      case 'float':
        return 'Float';
      case 'decimal':
        return 'Decimal';
      case 'boolean':
        return 'Boolean';
      case 'date':
      case 'datetime':
        return 'DateTime';
      case 'json':
        return 'Json';
      case 'uuid':
      case 'string':
      default:
        return 'String';
    }
  }

  String zodType(String t, bool isOptional) {
    String base;
    switch (t) {
      case 'int':
        base = 'z.number().int()';
        break;
      case 'float':
      case 'decimal':
        base = 'z.number()';
        break;
      case 'boolean':
        base = 'z.boolean()';
        break;
      case 'date':
      case 'datetime':
        base = 'z.coerce.date()';
        break;
      case 'json':
        base = 'z.record(z.any())';
        break;
      case 'uuid':
        base = 'z.string().uuid()';
        break;
      case 'string':
      default:
        base = 'z.string()';
    }
    return isOptional ? '$base.optional()' : base;
  }

  // ==== Coleta de campos ====
  logger.info('Enter the entity parameters.');

  final fields = <Map<String, dynamic>>[];

  while (true) {
    final name = ask('Field name (empty to finish)').trim();
    if (name.isEmpty) break;

    final type = askWithOptions(
      'Field type',
      [
        'string',
        'int',
        'float',
        'boolean',
        'date',
        'datetime',
        'uuid',
        'json',
        'decimal'
      ],
      defaultValue: 'string',
    );

    final isOptional =
        askWithOptions('Is optional field?', ['y', 'n'], defaultValue: 'n') ==
            'y';
    final description = ask('Field description (optional)');

    final map = <String, dynamic>{
      'name': name,
      'type': type,
      'isOptional': isOptional,
      'description': description,
      'tsType': tsType(type),
      'prismaType': prismaType(type),
      'zodType': zodType(type, isOptional),
    };

    if (name == 'id' && type == 'uuid') {
      map['is_uuid'] = true;
    }

    fields.add(map);
    logger
        .info('→ Added field: $name: $type${isOptional ? ' (optional)' : ''}');
  }

  if (fields.isEmpty) {
    logger.warn('No fields added. Inserting default id: uuid.');
    fields.add({
      'name': 'id',
      'type': 'uuid',
      'isOptional': false,
      'description': 'Unique identifier',
      'tsType': 'string',
      'prismaType': 'String',
      'zodType': 'z.string().uuid()',
      'is_uuid': true,
    });
  }

  // ==== class-validator ====
  final validatorImports = <String>{};
  var needsTypeImport = false;

  for (final f in fields) {
    final t = (f['type'] as String);
    final isOptional = (f['isOptional'] as bool);
    final name = (f['name'] as String);

    final validators = <String>[];

    if (isOptional) {
      validators.add('IsOptional()');
      validatorImports.add('IsOptional');
    } else {
      validators.add('IsDefined()');
      validatorImports.add('IsDefined');
      if (t == 'string') {
        validators.add('IsNotEmpty()');
        validatorImports.add('IsNotEmpty');
      }
    }

    switch (t) {
      case 'string':
        validators.add('IsString()');
        validatorImports.add('IsString');
        if (name.toLowerCase().contains('email')) {
          validators.add('IsEmail()');
          validatorImports.add('IsEmail');
        }
        if (f['maxLength'] != null) {
          validators.add('MaxLength(${f['maxLength']})');
          validatorImports.add('MaxLength');
        }
        if (f['minLength'] != null) {
          validators.add('MinLength(${f['minLength']})');
          validatorImports.add('MinLength');
        }
        break;

      case 'uuid':
        validators.add('IsUUID()');
        validatorImports.add('IsUUID');
        break;

      case 'int':
        validators.add('IsInt()');
        validatorImports.add('IsInt');
        break;

      case 'float':
      case 'decimal':
        validators.add('IsNumber()');
        validatorImports.add('IsNumber');
        break;

      case 'boolean':
        validators.add('IsBoolean()');
        validatorImports.add('IsBoolean');
        break;

      case 'date':
      case 'datetime':
        validators.add('IsDate()');
        validatorImports.add('IsDate');
        f['useTypeDate'] = true;
        needsTypeImport = true;
        break;

      case 'json':
        validators.add('IsObject()');
        validatorImports.add('IsObject');
        break;
    }

    f['validators'] = validators;
    f['description'] = (f['description'] ?? '').toString();
    f['useTypeDate'] = (f['useTypeDate'] == true);
  }

  // ==== Sanitização final (sem nulls / tipos corretos) ====
  for (final f in fields) {
    // TIPAGEM EXPLÍCITA para aceitar null sem estourar:
    f.removeWhere((String _, Object? value) => value == null);

    f['validators'] =
        (f['validators'] as List?)?.whereType<String>().toList() ?? <String>[];
    f['isOptional'] = (f['isOptional'] == true);
    f['useTypeDate'] = (f['useTypeDate'] == true);
  }

  // ==== Campos obrigatórios (para montar IF sem || sobrando) ====
  final required = fields.where((f) => !(f['isOptional'] as bool)).toList();
  for (var i = 0; i < required.length; i++) {
    required[i]['isFirstRequired'] = i == 0;
  }

  // ==== Exposição para templates ====
  context.vars['fields'] = fields;
  context.vars['required_fields'] = required;
  context.vars['has_required'] = required.isNotEmpty;

  final importsList = validatorImports.toList()..sort();
  context.vars['validator_imports'] = importsList;
  context.vars['validator_imports_csv'] = importsList.join(', ');
  context.vars['has_validator_imports'] = importsList.isNotEmpty;
  context.vars['needs_type_import'] = needsTypeImport;
}
