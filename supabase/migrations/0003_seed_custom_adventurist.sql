-- Smoke-test client for sprint 1. Public marketing URLs only; no personal
-- contact details.

insert into clients (slug, custom_domain, name, bio, avatar_url)
values (
  'customadventurist',
  'customadventurist.com',
  'Custom Adventurist',
  E'Tech Enthusiast\nFake Vs Real Specialist',
  '/ca-mark.svg'
);

insert into theme_settings (client_id, color, font)
select id, '#2F6BFF', 'Inter' from clients where slug = 'customadventurist';

insert into links (client_id, title, url, position)
select c.id, x.title, x.url, x.position
from clients c,
lateral (values
  (0, 'Anker Smart Display Hub', 'https://www.anker.com/'),
  (1, 'RayNeo GT AR Glasses', 'https://dada.link/5yA4zsu'),
  (2, 'RayNeo GT AR/XR Glasses - Amazon', 'https://dada.link/HvOX3e'),
  (3, 'RayNeo GT Max AR Glasses', 'https://dada.link/2-lL_75'),
  (4, 'RayNeo GT Max AR/XR Glasses - Amazon', 'https://dada.link/hwe35k'),
  (5, 'Speak On - Discount Code: Ben10', 'https://speakon.app/discount/Ben10'),
  (6, 'VITURE Pro 2 XR Glasses', 'https://viture.us/customadventuristPro2'),
  (7, 'Forma PDF Editor App', 'https://formaapp.one/link.me/u/Yu/2shqr8wa'),
  (8, 'Dubbing AI', 'https://dubbingvc.myshopify.com/products/dubbing-ai'),
  (9, 'Dream Traveller Luggage', 'https://dreamtraveller.com/jsct0'),
  (10, 'Joyroom Podix P170', 'https://www.kickstarter.com/projects/joyroompodix'),
  (11, 'DOOGEE V50 Pro Rugged Phone', 'https://www.doogee.com/i/US/customadventuristV50p'),
  (12, 'Hollyland Lark A1 Microphone', 'https://amzn.to/4uEI13k'),
  (13, 'Melo P1 Microphone', 'https://amzn.to/4ujN1YF'),
  (14, 'Looki L1 AI Companion', 'https://looki.ai/'),
  (15, 'Unplug Earbuds', 'https://bit.ly/4pDEFUU'),
  (16, 'Torras World Cup Phones Cases CODE: CUSGOAL26', 'https://a.co/d/02VFwu5O'),
  (17, 'XREAL One Pro! Use code CUSTOM', 'https://us.shop.xreal.com/products/xreal-one-pro'),
  (18, 'iFlyTek AI Note', 'https://iflytek.biz/4zg4nMa'),
  (19, 'Viture Glasses - CODE: customadventurist', 'https://viture.us/customadventurist'),
  (20, 'YouTube', 'https://youtube.com/@CustomAdventurist'),
  (21, 'Instagram', 'https://instagram.com/custom_adventurist'),
  (22, 'TikTok', 'https://tiktok.com/@customadventurist')
) as x(position, title, url)
where c.slug = 'customadventurist';
