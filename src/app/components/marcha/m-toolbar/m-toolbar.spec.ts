import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MToolbar, MToolbarItem } from './m-toolbar';

describe('MToolbar', () => {
  let fixture: ComponentFixture<MToolbar>;
  let component: MToolbar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MToolbar] }).compileComponents();
    fixture = TestBed.createComponent(MToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('defaults: position=bottom, variant=floating, collapsed=true', () => {
    expect(component.position()).toBe('bottom');
    expect(component.variant()).toBe('floating');
    expect(component.collapsed()).toBeTrue();
    expect(component.collapsible()).toBeFalse();
  });

  it('_cssClass includes position and variant modifiers', () => {
    expect(component._cssClass()).toContain('m-toolbar--bottom');
    expect(component._cssClass()).toContain('m-toolbar--floating');
  });

  it('_cssClass includes m-toolbar--horizontal for top/bottom positions', () => {
    expect(component._cssClass()).toContain('m-toolbar--horizontal');
    fixture.componentRef.setInput('position', 'top');
    expect(component._cssClass()).toContain('m-toolbar--horizontal');
  });

  it('_cssClass includes m-toolbar--vertical for left/right positions', () => {
    fixture.componentRef.setInput('position', 'left');
    expect(component._cssClass()).toContain('m-toolbar--vertical');
    fixture.componentRef.setInput('position', 'right');
    expect(component._cssClass()).toContain('m-toolbar--vertical');
  });

  it('_cssClass includes m-toolbar--collapsed when collapsed', () => {
    expect(component._cssClass()).toContain('m-toolbar--collapsed');
  });

  it('_cssClass includes m-toolbar--expanded when not collapsed', () => {
    fixture.componentRef.setInput('collapsed', false);
    expect(component._cssClass()).toContain('m-toolbar--expanded');
  });

  it('_cssClass includes m-toolbar--collapsible when collapsible input is true', () => {
    fixture.componentRef.setInput('collapsible', true);
    expect(component._cssClass()).toContain('m-toolbar--collapsible');
  });

  it('toggle() flips collapsed state', () => {
    expect(component.collapsed()).toBeTrue();
    component.toggle();
    expect(component.collapsed()).toBeFalse();
    component.toggle();
    expect(component.collapsed()).toBeTrue();
  });

  it('_toggleIcon returns correct icons for bottom position', () => {
    // collapsed=true, bottom → chevron-up (indica expandir hacia arriba)
    expect(component._toggleIcon()).toBe('lucide:chevron-up');
    fixture.componentRef.setInput('collapsed', false);
    expect(component._toggleIcon()).toBe('lucide:chevron-down');
  });

  it('_toggleIcon returns correct icons for top position', () => {
    fixture.componentRef.setInput('position', 'top');
    expect(component._toggleIcon()).toBe('lucide:chevron-down');
    fixture.componentRef.setInput('collapsed', false);
    expect(component._toggleIcon()).toBe('lucide:chevron-up');
  });

  it('_toggleIcon returns correct icons for left position', () => {
    fixture.componentRef.setInput('position', 'left');
    expect(component._toggleIcon()).toBe('lucide:chevron-right');
    fixture.componentRef.setInput('collapsed', false);
    expect(component._toggleIcon()).toBe('lucide:chevron-left');
  });

  it('_toggleIcon returns correct icons for right position', () => {
    fixture.componentRef.setInput('position', 'right');
    expect(component._toggleIcon()).toBe('lucide:chevron-left');
    fixture.componentRef.setInput('collapsed', false);
    expect(component._toggleIcon()).toBe('lucide:chevron-right');
  });

  it('_isVertical is true for left and right positions', () => {
    fixture.componentRef.setInput('position', 'left');
    expect(component._isVertical()).toBeTrue();
    fixture.componentRef.setInput('position', 'right');
    expect(component._isVertical()).toBeTrue();
  });

  it('_isVertical is false for top and bottom positions', () => {
    expect(component._isVertical()).toBeFalse();
    fixture.componentRef.setInput('position', 'top');
    expect(component._isVertical()).toBeFalse();
  });

  it('onItemClick emits itemClick for enabled items', () => {
    const item: MToolbarItem = { id: '1', icon: 'lucide:home', label: 'Inicio' };
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onItemClick(item);
    expect(spy).toHaveBeenCalledWith(item);
  });

  it('onItemClick does not emit for disabled items', () => {
    const item: MToolbarItem = { id: '1', icon: 'lucide:home', disabled: true };
    const spy = jasmine.createSpy('itemClick');
    component.itemClick.subscribe(spy);
    component.onItemClick(item);
    expect(spy).not.toHaveBeenCalled();
  });

  it('onItemClick executes item command if provided', () => {
    const commandSpy = jasmine.createSpy('command');
    const item: MToolbarItem = { id: '1', icon: 'lucide:home', command: commandSpy };
    component.onItemClick(item);
    expect(commandSpy).toHaveBeenCalled();
  });
});
