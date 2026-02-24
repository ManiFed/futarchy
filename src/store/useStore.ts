import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, SectionId } from '../types';
import { runSimulationEngine } from '../utils/simulation';

export const useStore = create<AppState>((set, get) => ({
  labName: 'Untitled Lab',
  status: 'draft',
  activeSection: 'policy',
  inspectorOpen: false,
  inspectorContent: null,

  policy: {
    title: '',
    description: '',
    parameters: [
      {
        id: uuidv4(),
        name: 'Tax Rate',
        value: 15,
        min: 0,
        max: 100,
        step: 0.5,
        unit: '%',
      },
    ],
    timeHorizon: '1y',
    customMonths: 12,
    assumptions: '',
  },

  outcome: {
    metricType: null,
    name: '',
    unit: '%',
    resolutionTiming: '',
    expectedBaseline: 50,
    expectedWithPolicy: 65,
    resolutionRule: '',
  },

  markets: {
    passMarket: {
      initialLiquidity: 50000,
      feePercent: 2,
      liquidityDepth: 50,
    },
    failMarket: {
      initialLiquidity: 50000,
      feePercent: 2,
      liquidityDepth: 50,
    },
  },

  simulation: null,
  isSimulating: false,

  setLabName: (name) => set({ labName: name }),
  setActiveSection: (section: SectionId) => set({ activeSection: section }),
  setInspector: (content) =>
    set({ inspectorOpen: content !== null, inspectorContent: content }),

  updatePolicy: (updates) =>
    set((state) => ({ policy: { ...state.policy, ...updates } })),

  addPolicyParameter: () =>
    set((state) => ({
      policy: {
        ...state.policy,
        parameters: [
          ...state.policy.parameters,
          {
            id: uuidv4(),
            name: 'New Parameter',
            value: 50,
            min: 0,
            max: 100,
            step: 1,
            unit: '',
          },
        ],
      },
    })),

  updatePolicyParameter: (id, updates) =>
    set((state) => ({
      policy: {
        ...state.policy,
        parameters: state.policy.parameters.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      },
    })),

  removePolicyParameter: (id) =>
    set((state) => ({
      policy: {
        ...state.policy,
        parameters: state.policy.parameters.filter((p) => p.id !== id),
      },
    })),

  updateOutcome: (updates) =>
    set((state) => ({ outcome: { ...state.outcome, ...updates } })),

  updatePassMarket: (updates) =>
    set((state) => ({
      markets: {
        ...state.markets,
        passMarket: { ...state.markets.passMarket, ...updates },
      },
    })),

  updateFailMarket: (updates) =>
    set((state) => ({
      markets: {
        ...state.markets,
        failMarket: { ...state.markets.failMarket, ...updates },
      },
    })),

  runSimulation: () => {
    const state = get();
    set({ isSimulating: true, status: 'simulating', simulation: null });

    setTimeout(() => {
      const result = runSimulationEngine(
        state.policy,
        state.outcome,
        state.markets
      );
      set({ simulation: result, isSimulating: false, status: 'completed' });
    }, 2000);
  },

  resetSimulation: () =>
    set({ simulation: null, status: 'draft', isSimulating: false }),

  getSectionCompletion: () => {
    const state = get();
    return {
      policy:
        state.policy.title.trim().length > 0 &&
        state.policy.parameters.length > 0,
      outcome:
        state.outcome.metricType !== null &&
        state.outcome.name.trim().length > 0,
      markets:
        state.markets.passMarket.initialLiquidity > 0 &&
        state.markets.failMarket.initialLiquidity > 0,
      results: state.simulation !== null,
    };
  },
}));
