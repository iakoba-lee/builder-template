-- Optional discount line for a page link. Blank means the public page
-- shows the title on one line. Profile socials leave this null.

alter table links
  add column discount_code text;

-- Move a trailing code phrase out of titles that were typed as one string.
update links
set
  discount_code = btrim(substring(title from '(?i)(?:[[:space:]]+[-–—][[:space:]]+|[[:space:]]*[.;!][[:space:]]+)((?:use[[:space:]]+)?(?:discount[[:space:]]+)?code\M.*)$')),
  title = btrim(substring(title from '(?i)^(.*)(?:[[:space:]]+[-–—][[:space:]]+|[[:space:]]*[.;!][[:space:]]+)(?:use[[:space:]]+)?(?:discount[[:space:]]+)?code\M'))
where placement = 'page'
  and discount_code is null
  and title ~* '(?:[[:space:]]+[-–—][[:space:]]+|[[:space:]]*[.;!][[:space:]]+)(?:use[[:space:]]+)?(?:discount[[:space:]]+)?code\M';
