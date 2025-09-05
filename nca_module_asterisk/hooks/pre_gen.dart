import 'package:diacritic/diacritic.dart';
import 'package:mason/mason.dart';

void run(HookContext context) {
  context.vars['module_folder_name'] = removeDiacritics(
      context.vars['name'].toString().toLowerCase().replaceAll(' ', '-'));
  context.vars['module_name'] =
      removeDiacritics(context.vars['name'].toString());
}
