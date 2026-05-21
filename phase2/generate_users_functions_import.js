const xlsx = require('xlsx');
const fs   = require('fs');

const wb   = xlsx.readFile('templates/_UsersFunctions.xlsx');
const ws   = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

const esc = v => (v === null || v === undefined || v === 'NULL') ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;

const values = rows.map(r => {
  const uf_id       = r['Id']          != null ? parseInt(r['Id'])          : null;
  const function_id = r['Function_Id'] != null ? parseInt(r['Function_Id']) : null;
  const username    = r['UserName'];
  const user_right  = (r['User_Right'] === 'NULL' || r['User_Right'] == null) ? null : r['User_Right'];

  return `  (${uf_id ?? 'NULL'}, ${function_id ?? 'NULL'}, ${esc(username)}, ${esc(user_right)})`;
}).join(',\n');

const sql = `-- Import ${rows.length} dòng vào users_functions
-- Nguồn: templates/_UsersFunctions.xlsx / sheet: UserFunction | ${new Date().toISOString()}
-- Chiến lược: ON CONFLICT (username, function_id) DO UPDATE

INSERT INTO public.users_functions (uf_id, function_id, username, user_right)
VALUES
${values}
ON CONFLICT (username, function_id) DO UPDATE
  SET uf_id      = EXCLUDED.uf_id,
      user_right = EXCLUDED.user_right,
      updated_at = now();
`;

fs.writeFileSync('phase2/users_functions_import.sql', sql);
console.log('Generated phase2/users_functions_import.sql —', rows.length, 'rows');
