#!/bin/bash

# Create new feature with Container/Presentational pattern
# Usage: ./scripts/create-feature.sh user

if [ $# -lt 1 ]; then
    echo "Usage: $0 <feature-name>"
    echo "Example: $0 user"
    exit 1
fi

FEATURE=$1
FEATURE_UPPER="$(tr '[:lower:]' '[:upper:]' <<< ${FEATURE:0:1})${FEATURE:1}"
FEATURE_PATH="src/app/features/${FEATURE}"

# Check if feature exists
if [ -d "$FEATURE_PATH" ]; then
    echo "❌ Error: Feature '${FEATURE}' already exists!"
    exit 1
fi

echo "🚀 Creating feature: ${FEATURE}"
echo ""

# Create directory structure
mkdir -p "${FEATURE_PATH}/containers/${FEATURE}-container"
mkdir -p "${FEATURE_PATH}/components"
mkdir -p "${FEATURE_PATH}/services"
mkdir -p "${FEATURE_PATH}/stores"
mkdir -p "${FEATURE_PATH}/models"
mkdir -p "${FEATURE_PATH}/resolvers"

# Container Component TypeScript
cat > "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.ts" << 'EOF'
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-FEATURE-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './FEATURE-container.component.html',
  styleUrl: './FEATURE-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FEATUREContainerComponent implements OnInit {
  // Inject Store & Services
  // private FEATUREStore = inject(FEATUREStore);
  // private FEATUREBusiness = inject(FEATUREBusinessService);
  private route = inject(ActivatedRoute);
  
  ngOnInit() {
    // Get data from resolver
    const FEATUREs = this.route.snapshot.data['FEATUREs'];
    
    // Set in store
    // this.FEATUREStore.setFEATUREs(FEATUREs);
  }
  
  // Event Handlers
  onCreate() {
    // Handle create
  }
  
  onEdit(id: string) {
    // Handle edit
  }
  
  onDelete(id: string) {
    // Handle delete
  }
}
EOF

# Replace placeholders
sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.ts"

# Container Component HTML
cat > "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.html" << 'EOF'
<div class="FEATURE-container">
  <h1>FEATUREUPPER</h1>
  
  <!-- Add child components here -->
  
</div>
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.html"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.html"

# Container Component SCSS
cat > "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.scss" << 'EOF'
.FEATURE-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.scss"

# Container Component Spec
cat > "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.spec.ts" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FEATUREContainerComponent } from './FEATURE-container.component';

describe('FEATUREContainerComponent', () => {
  let component: FEATUREContainerComponent;
  let fixture: ComponentFixture<FEATUREContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FEATUREContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FEATUREContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load FEATUREs on init', () => {
    component.ngOnInit();
    // Add assertions
  });
});
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.spec.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/containers/${FEATURE}-container/${FEATURE}-container.component.spec.ts"

# API Service
cat > "${FEATURE_PATH}/services/${FEATURE}-api.service.ts" << 'EOF'
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FEATUREApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/FEATUREs';

  async getAll(): Promise<FEATUREUPPER[]> {
    return firstValueFrom(
      this.http.get<FEATUREUPPER[]>(this.apiUrl)
    );
  }

  async getById(id: string): Promise<FEATUREUPPER> {
    return firstValueFrom(
      this.http.get<FEATUREUPPER>(`${this.apiUrl}/${id}`)
    );
  }

  async create(data: CreateFEATUREUpperDTO): Promise<FEATUREUPPER> {
    return firstValueFrom(
      this.http.post<FEATUREUPPER>(this.apiUrl, data)
    );
  }

  async update(id: string, data: Partial<CreateFEATUREUpperDTO>): Promise<FEATUREUPPER> {
    return firstValueFrom(
      this.http.put<FEATUREUPPER>(`${this.apiUrl}/${id}`, data)
    );
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`)
    );
  }
}
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/services/${FEATURE}-api.service.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/services/${FEATURE}-api.service.ts"

# Business Service
cat > "${FEATURE_PATH}/services/${FEATURE}-business.service.ts" << 'EOF'
import { Injectable, inject } from '@angular/core';
import { FEATUREApiService } from './FEATURE-api.service';

@Injectable({ providedIn: 'root' })
export class FEATUREBusinessService {
  private FEATUREApi = inject(FEATUREApiService);

  async validateAndCreate(data: any): Promise<any> {
    // Business rules & validation
    
    // Example: Check uniqueness
    // const existing = await this.FEATUREApi.getAll();
    // if (existing.some(item => item.name === data.name)) {
    //   throw new Error('Name already exists');
    // }
    
    return this.FEATUREApi.create(data);
  }

  async confirmDelete(id: string): Promise<boolean> {
    // Show confirmation dialog
    return confirm('Are you sure you want to delete this FEATURE?');
  }
}
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/services/${FEATURE}-business.service.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/services/${FEATURE}-business.service.ts"

# Signal Store
cat > "${FEATURE_PATH}/stores/${FEATURE}.store.ts" << 'EOF'
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FEATUREApiService } from '../services/FEATURE-api.service';

interface FEATUREState {
  FEATUREs: any[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const FEATUREStore = signalStore(
  { providedIn: 'root' },
  
  withState<FEATUREState>({
    FEATUREs: [],
    selectedId: null,
    loading: false,
    error: null
  }),
  
  withComputed(({ FEATUREs, selectedId }) => ({
    selectedFEATURE: computed(() => 
      FEATUREs().find(item => item.id === selectedId()) ?? null
    ),
    FEATURECount: computed(() => FEATUREs().length),
    hasFEATUREs: computed(() => FEATUREs().length > 0)
  })),
  
  withMethods((store, FEATUREApi = inject(FEATUREApiService)) => ({
    async loadFEATUREs() {
      patchState(store, { loading: true, error: null });
      try {
        const FEATUREs = await FEATUREApi.getAll();
        patchState(store, { FEATUREs, loading: false });
      } catch (error: any) {
        patchState(store, { error: error.message, loading: false });
      }
    },
    
    setFEATUREs(FEATUREs: any[]) {
      patchState(store, { FEATUREs });
    },
    
    addFEATURE(FEATURE: any) {
      patchState(store, { 
        FEATUREs: [...store.FEATUREs(), FEATURE] 
      });
    },
    
    async deleteFEATURE(id: string) {
      await FEATUREApi.delete(id);
      patchState(store, { 
        FEATUREs: store.FEATUREs().filter(item => item.id !== id) 
      });
    },
    
    selectFEATURE(id: string | null) {
      patchState(store, { selectedId: id });
    },
    
    clearFEATUREs() {
      patchState(store, { FEATUREs: [], selectedId: null });
    }
  }))
);
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/stores/${FEATURE}.store.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/stores/${FEATURE}.store.ts"

# Model
cat > "${FEATURE_PATH}/models/${FEATURE}.model.ts" << 'EOF'
export interface FEATUREUPPER {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFEATUREUpperDTO {
  name: string;
}

export interface FEATUREFilter {
  searchTerm: string;
  sortBy: 'name' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}
EOF

sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/models/${FEATURE}.model.ts"

# Resolver
cat > "${FEATURE_PATH}/resolvers/${FEATURE}.resolver.ts" << 'RESOLVEREOF'
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FEATUREApiService } from '../services/FEATURE-api.service';
import { FEATUREUPPER } from '../models/FEATURE.model';

/**
 * Resolver to load FEATUREs before route activation
 */
export const FEATUREResolver: ResolveFn<FEATUREUPPER[]> = async () => {
  const api = inject(FEATUREApiService);
  return api.getAll();
};
RESOLVEREOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/resolvers/${FEATURE}.resolver.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/resolvers/${FEATURE}.resolver.ts"

# Routes
cat > "${FEATURE_PATH}/${FEATURE}.routes.ts" << 'EOF'
import { Routes } from '@angular/router';
import { FEATUREResolver } from './resolvers/FEATURE.resolver';

export const FEATUREUPPER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/FEATURE-container/FEATURE-container.component')
      .then(m => m.FEATUREContainerComponent),
    resolve: {
      FEATUREs: FEATUREResolver
    }
  }
];
EOF

sed -i "s/FEATURE/${FEATURE}/g" "${FEATURE_PATH}/${FEATURE}.routes.ts"
sed -i "s/FEATUREUPPER/${FEATURE_UPPER}/g" "${FEATURE_PATH}/${FEATURE}.routes.ts"

echo "✅ Feature '${FEATURE}' created successfully!"
echo ""
echo "📁 Created files:"
echo "   ✅ Container: ${FEATURE}-container.component.ts/html/scss/spec.ts"
echo "   ✅ API Service: ${FEATURE}-api.service.ts"
echo "   ✅ Business Service: ${FEATURE}-business.service.ts"
echo "   ✅ Signal Store: ${FEATURE}.store.ts"
echo "   ✅ Model: ${FEATURE}.model.ts"
echo "   ✅ Resolver: ${FEATURE}.resolver.ts"
echo "   ✅ Routes: ${FEATURE}.routes.ts (with resolver)"
echo ""
echo "📝 Next steps:"
echo "   1. Add route to app.routes.ts:"
echo "      {"
echo "        path: '${FEATURE}s',"
echo "        loadChildren: () => import('./features/${FEATURE}/${FEATURE}.routes')"
echo "          .then(m => m.${FEATURE_UPPER}_ROUTES)"
echo "      }"
echo ""
echo "   2. Resolver loads data BEFORE route activation"
echo "   3. Container gets data from route.snapshot.data['${FEATURE}s']"
echo ""
echo "   4. Create presentational components:"
echo "      ./scripts/create-component.sh ${FEATURE} ${FEATURE}-list"
echo ""
echo "   5. Implement business logic in:"
echo "      ${FEATURE_PATH}/services/${FEATURE}-business.service.ts"
echo ""
