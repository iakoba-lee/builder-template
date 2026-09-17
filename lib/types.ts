export type Client = {
  id: string;
  slug: string;
  custom_domain: string | null;
  name: string;
  bio: string | null;
  avatar_url: string | null;
};

export type ThemeSettings = {
  id: string;
  client_id: string;
  color: string;
  font: string;
};

export type LinkRow = {
  id: string;
  client_id: string;
  title: string;
  url: string;
  position: number;
};
