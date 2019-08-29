import {NgbNavTabsetConfig} from './navtab-config';

describe('ngb-tabset-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbNavTabsetConfig();

    expect(config.type).toBe('tabs');
    expect(config.justify).toBe('start');
  });
});
