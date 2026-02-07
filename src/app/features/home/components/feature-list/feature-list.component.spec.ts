import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureListComponent } from './feature-list.component';

describe('FeatureListComponent', () => {
  let component: FeatureListComponent;
  let fixture: ComponentFixture<FeatureListComponent>;

  const mockFeatures = [
    { id: 'test-1', title: 'Feature 1', description: 'Description 1', icon: '🔥' },
    { id: 'test-2', title: 'Feature 2', description: 'Description 2', icon: '⚡' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('features', mockFeatures);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display features', () => {
    expect(component.features().length).toBe(2);
  });

  it('should emit featureClick on click', () => {
    const emitSpy = jest.spyOn(component.featureClick, 'emit');

    component.onFeatureClick(mockFeatures[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockFeatures[0]);
  });

  it('should render feature cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.feature-card');
    expect(cards.length).toBe(2);
  });
});
