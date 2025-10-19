export interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[]; // الأدوار المسموح لها برؤية هذا العنصر
}
