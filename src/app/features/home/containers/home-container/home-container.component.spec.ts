import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeContainerComponent } from './home-container.component';

describe('HomeContainerComponent', () => {
  let component: HomeContainerComponent;
  let fixture: ComponentFixture<HomeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 features', () => {
    expect(component.features().length).toBe(6);
  });

  it('should have default userName', () => {
    expect(component.userName()).toBe('Developer');
  });

  it('should handle feature click', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const feature = component.features()[0];

    component.onFeatureClick(feature);

    expect(consoleSpy).toHaveBeenCalledWith('Feature clicked:', feature.title);
  });
});
