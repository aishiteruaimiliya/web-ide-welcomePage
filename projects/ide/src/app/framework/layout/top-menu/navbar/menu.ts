export class Divider {
  id: string = 'divider';
}

export class MenuItem {
  label: string;
  disabled?: boolean;
}

export class Lvl3MenuItem extends MenuItem {
  command: string;
}

export class Lvl2MenuItem extends MenuItem {
  submenu?: Array<Lvl3MenuItem | Divider>;
  command?: string;
}


export class Lvl1MenuItem extends MenuItem {
  submenu: Array<Lvl2MenuItem | Divider>;
}

export class Menu {
  items: Array<Lvl1MenuItem>;
}
