/// <reference types="astro/client" />

type AdminUser = { id: number; username: string };

declare namespace App {
  interface Locals {
    user: AdminUser | null;
  }
}
