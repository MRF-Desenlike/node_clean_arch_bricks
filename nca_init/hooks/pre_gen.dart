import 'package:mason/mason.dart';
import 'package:diacritic/diacritic.dart';

void run(HookContext context) async {
  context.vars['secret'] = DateTime.now().millisecondsSinceEpoch.toString();
  context.vars['project_name'] = removeDiacritics(
      context.vars['name'].toString().toLowerCase().replaceAll(' ', '_'));
}
