import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MPanel } from './m-panel';

describe('MPanel', () => {
  let fixture: ComponentFixture<MPanel>;
  let component: MPanel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MPanel] }).compileComponents();
    fixture = TestBed.createComponent(MPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should default to severity "default" and not collapsed', () => {
    expect(component.severity()).toBe('default');
    expect(component.collapsed()).toBeFalse();
    expect(component.collapsible()).toBeFalse();
  });

  it('_cssClass includes severity modifier', () => {
    fixture.componentRef.setInput('severity', 'info');
    expect(component._cssClass()).toContain('m-panel--info');
  });

  it('_cssClass includes m-panel--collapsible when collapsible', () => {
    fixture.componentRef.setInput('collapsible', true);
    expect(component._cssClass()).toContain('m-panel--collapsible');
  });

  it('_cssClass includes m-panel--collapsed when collapsed', () => {
    fixture.componentRef.setInput('collapsible', true);
    fixture.componentRef.setInput('collapsed', true);
    expect(component._cssClass()).toContain('m-panel--collapsed');
  });

  it('_cssClass includes m-panel--filled when filled', () => {
    fixture.componentRef.setInput('filled', true);
    expect(component._cssClass()).toContain('m-panel--filled');
  });

  it('toggle() flips collapsed when collapsible', () => {
    fixture.componentRef.setInput('collapsible', true);
    expect(component.collapsed()).toBeFalse();
    component.toggle();
    expect(component.collapsed()).toBeTrue();
    component.toggle();
    expect(component.collapsed()).toBeFalse();
  });

  it('toggle() does nothing when not collapsible', () => {
    component.toggle();
    expect(component.collapsed()).toBeFalse();
  });

  it('_iconMap uses provided icon over severity default', () => {
    fixture.componentRef.setInput('icon', 'lucide:star');
    expect(component._iconMap()).toBe('lucide:star');
  });

  it('_iconMap uses severity icon when no icon input', () => {
    fixture.componentRef.setInput('severity', 'success');
    expect(component._iconMap()).toBe('lucide:circle-check');
  });

  it('_chipSeverityMap maps severity correctly', () => {
    fixture.componentRef.setInput('severity', 'warn');
    expect(component._chipSeverityMap()).toBe('warn');

    fixture.componentRef.setInput('severity', 'default');
    expect(component._chipSeverityMap()).toBe('secondary');
  });
});
