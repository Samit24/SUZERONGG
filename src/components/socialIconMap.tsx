import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { SiTryhackme } from "react-icons/si";
import { IconType } from "react-icons";
import { config } from "../config";

const icons: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  Instagram: FaInstagram,
  X: FaXTwitter,
  Facebook: FaFacebookF,
  TryHackMe: SiTryhackme,
};

// Social profiles that have a URL set in config.ts, with their icon.
export const activeSocials = config.socials
  .filter((s) => s.url)
  .map((s) => ({ ...s, Icon: icons[s.name] ?? FaGithub }));
