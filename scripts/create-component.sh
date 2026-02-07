#!/bin/bash

# Create presentational component
# Usage: ./scripts/create-component.sh user user-card

if [ $# -lt 2 ]; then
    echo "Usage: $0 <feature> <component-name>"
    echo "Example: $0 user user-card"
    exit 1
fi

FEATURE=$1
COMPONENT=$2
COMPONENT_UPPER="$(tr '[:lower:]' '[:upper:]' <<< ${COMPONENT:0:1})${COMPONENT:1}"
COMPONENT_CLASS=$(echo $COMPONENT | sed -r 's/(^|-)(\w)/\U\2/g')
COMPONENT_PATH="src/app/features/${FEATURE}/components/${COMPONENT}"

# Check if component exists
if [ -d "$COMPONENT_PATH" ]; then
    echo "❌ Error: Component '${COMPONENT}' already exists!"
    exit 1
fi

echo "🎨 Creating presentational component: ${COMPONENT}"
echo ""

# Create directory
mkdir -p "$COMPONENT_PATH"

# Component TypeScript
cat > "${COMPONENT_PATH}/${COMPONENT}.component.ts" << 'EOF'
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-COMPONENT',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './COMPONENT.component.html',
  styleUrl: './COMPONENT.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class COMPONENTCLASSComponent {
  // Inputs
  // data = input.required<any>();
  
  // Outputs
  // action = output<string>();
  
  // Methods
  // onAction() {
  //   this.action.emit('data');
  // }
}
EOF

sed -i "s/COMPONENT/${COMPONENT}/g" "${COMPONENT_PATH}/${COMPONENT}.component.ts"
sed -i "s/COMPONENTCLASS/${COMPONENT_CLASS}/g" "${COMPONENT_PATH}/${COMPONENT}.component.ts"

# Component HTML
cat > "${COMPONENT_PATH}/${COMPONENT}.component.html" << 'EOF'
<div class="COMPONENT">
  <!-- Add template here -->
  <p>COMPONENTCLASS works!</p>
</div>
EOF

sed -i "s/COMPONENT/${COMPONENT}/g" "${COMPONENT_PATH}/${COMPONENT}.component.html"
sed -i "s/COMPONENTCLASS/${COMPONENT_CLASS}/g" "${COMPONENT_PATH}/${COMPONENT}.component.html"

# Component SCSS
cat > "${COMPONENT_PATH}/${COMPONENT}.component.scss" << 'EOF'
.COMPONENT {
  // Add styles here
}
EOF

sed -i "s/COMPONENT/${COMPONENT}/g" "${COMPONENT_PATH}/${COMPONENT}.component.scss"

# Component Spec
cat > "${COMPONENT_PATH}/${COMPONENT}.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMPONENTCLASSComponent } from './COMPONENT.component';

describe('COMPONENTCLASSComponent', () => {
  let component: COMPONENTCLASSComponent;
  let fixture: ComponentFixture<COMPONENTCLASSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COMPONENTCLASSComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(COMPONENTCLASSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should emit action on click', () => {
    // Add test
  });
});
EOF

sed -i "s/COMPONENT/${COMPONENT}/g" "${COMPONENT_PATH}/${COMPONENT}.component.spec.ts"
sed -i "s/COMPONENTCLASS/${COMPONENT_CLASS}/g" "${COMPONENT_PATH}/${COMPONENT}.component.spec.ts"

echo "✅ Component created successfully!"
echo ""
echo "📁 Created files:"
echo "   ✅ ${COMPONENT_PATH}/${COMPONENT}.component.ts"
echo "   ✅ ${COMPONENT_PATH}/${COMPONENT}.component.html"
echo "   ✅ ${COMPONENT_PATH}/${COMPONENT}.component.scss"
echo "   ✅ ${COMPONENT_PATH}/${COMPONENT}.component.spec.ts"
echo ""
echo "📝 Next steps:"
echo "   1. Add inputs/outputs to component"
echo "   2. Import in container component"
echo "   3. Use in template: <app-${COMPONENT} />"
echo ""
