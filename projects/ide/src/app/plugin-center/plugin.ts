export interface IPlugin {
  name: string;
  target: string;
  loaded?: boolean;
  uri: string;
  activateCommand?: string;
}

export interface IMetaOpener extends IPlugin {
  prefix: string;
}
