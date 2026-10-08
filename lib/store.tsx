"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Goal =
  | "Emagrecer"
  | "Ganhar massa muscular"
  | "Emagrecer e ganhar massa"
  | "Manter peso";

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  rest: number;
  tips: string[];
  image: string;
  video: string;
};

export type Workout = {
  id: string;
  title: string;
  muscle: string;
  duration: number;
  exercises: string[];
  completed: boolean;
  date: string;
};

export type FoodEntry = {
  id: string;
  date: string;
  meal: string;
  description: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
};

export type UserProfile = {
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  goal: Goal;
  level: string;
  days: number;
  equipment: string;
  createdAt: string;
};

export type UserRecord = {
  id: string;
  passwordHash: string;
  profile: UserProfile;
  completedSets: Record<string, number>;
  foods: FoodEntry[];
  weights: WeightEntry[];
  workouts: Workout[];
  createdAt: string;
};

type Store = {
  users: UserRecord[];
  currentUserId: string | null;
};

const KEY = "neurofit_store_v1";

const initial: Store = {
  users: [],
  currentUserId: null,
};

/*
 * Usuário vazio usado durante o pré-render do Next.js.
 *
 * Isso evita erros como:
 * currentUser.foods
 * currentUser.profile
 * currentUser.workouts
 *
 * enquanto o localStorage ainda não foi carregado.
 */
const EMPTY_USER: UserRecord = {
  id: "__guest__",
  passwordHash: "",
  profile: {
    name: "Usuário",
    email: "",
    age: 0,
    height: 0,
    weight: 0,
    targetWeight: 0,
    goal: "Emagrecer e ganhar massa",
    level: "Iniciante",
    days: 4,
    equipment: "Academia",
    createdAt: "",
  },
  completedSets: {},
  foods: [],
  weights: [],
  workouts: [],
  createdAt: "",
};

export const exercises: Exercise[] = [
  {
    id: "supino",
    name: "Supino reto",
    muscle: "Peito",
    sets: 4,
    reps: 10,
    rest: 90,
    tips: [
      "Mantenha os pés firmes no chão.",
      "Desça a barra com controle até a linha do peito.",
      "Evite tirar os ombros do banco.",
    ],
    image: "/exercises/supino.svg",
    video: "/exercises/videos/supino.mp4",
  },

  {
    id: "agachamento",
    name: "Agachamento livre",
    muscle: "Pernas",
    sets: 4,
    reps: 10,
    rest: 120,
    tips: [
      "Mantenha o tronco firme.",
      "Joelhos acompanham a direção dos pés.",
      "Desça apenas até onde mantém boa técnica.",
    ],
    image: "/exercises/agachamento.svg",
    video: "/exercises/videos/agachamento.mp4",
  },

  {
    id: "puxada",
    name: "Puxada frontal",
    muscle: "Costas",
    sets: 3,
    reps: 12,
    rest: 90,
    tips: [
      "Peito aberto e coluna neutra.",
      "Puxe em direção à parte alta do peito.",
      "Evite balançar o corpo.",
    ],
    image: "/exercises/puxada.svg",
    video: "/exercises/videos/puxada.mp4",
  },

  {
    id: "remada",
    name: "Remada baixa",
    muscle: "Costas",
    sets: 3,
    reps: 12,
    rest: 90,
    tips: [
      "Comece com os braços estendidos.",
      "Puxe levando os cotovelos para trás.",
      "Controle a volta.",
    ],
    image: "/exercises/remada.svg",
    video: "/exercises/videos/remada.mp4",
  },

  {
    id: "rosca",
    name: "Rosca direta",
    muscle: "Bíceps",
    sets: 3,
    reps: 12,
    rest: 60,
    tips: [
      "Mantenha os cotovelos próximos ao corpo.",
      "Não balance o tronco.",
      "Controle a descida.",
    ],
    image: "/exercises/rosca.svg",
    video: "/exercises/videos/rosca.mp4",
  },

  {
    id: "triceps",
    name: "Tríceps pulley",
    muscle: "Tríceps",
    sets: 3,
    reps: 12,
    rest: 60,
    tips: [
      "Cotovelos estáveis.",
      "Empurre até perto da extensão completa.",
      "Retorne lentamente.",
    ],
    image: "/exercises/triceps.svg",
    video: "/exercises/videos/triceps.mp4",
  },
];

function load(): Store {
  if (typeof window === "undefined") {
    return initial;
  }

  try {
    const saved = localStorage.getItem(KEY);

    if (!saved) {
      return initial;
    }

    return JSON.parse(saved) as Store;
  } catch {
    return initial;
  }
}

function save(store: Store) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(KEY, JSON.stringify(store));
}

async function hash(value: string) {
  const data = new TextEncoder().encode(value);

  const buffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const Ctx = createContext<any>(null);

export function NeurofitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store, setStore] = useState<Store>(initial);
  const [ready, setReady] = useState(false);

  /*
   * Carrega os dados somente no navegador.
   */
  useEffect(() => {
    setStore(load());
    setReady(true);
  }, []);

  /*
   * Salva alterações no localStorage.
   */
  useEffect(() => {
    if (ready) {
      save(store);
    }
  }, [store, ready]);

  /*
   * Usuário autenticado.
   */
  const current =
    store.users.find(
      (user) => user.id === store.currentUserId
    ) || null;

  /*
   * Atualiza somente o usuário atualmente logado.
   */
  const updateUser = (
    fn: (user: UserRecord) => UserRecord
  ) => {
    setStore((currentStore) => ({
      ...currentStore,

      users: currentStore.users.map((user) =>
        user.id === currentStore.currentUserId
          ? fn(user)
          : user
      ),
    }));
  };

  const api = useMemo(
    () => ({
      /*
       * ready:
       * indica se o localStorage já foi carregado.
       *
       * authenticated:
       * indica se existe usuário real logado.
       *
       * currentUser:
       * durante o build/pré-render usamos EMPTY_USER
       * para evitar acesso a null.
       */
      ready,

      authenticated: Boolean(current),

      currentUser: current ?? EMPTY_USER,

      exercises,

      async register(data: {
        name: string;
        email: string;
        password: string;
      }) {
        const email = data.email.trim().toLowerCase();

        if (
          store.users.some(
            (user) => user.profile.email === email
          )
        ) {
          throw new Error(
            "Este e-mail já está cadastrado."
          );
        }

        const now = new Date().toISOString();

        const id = crypto.randomUUID();

        const passwordHash = await hash(
          data.password
        );

        const profile: UserProfile = {
          name: data.name,
          email,
          age: 0,
          height: 0,
          weight: 0,
          targetWeight: 0,
          goal: "Emagrecer e ganhar massa",
          level: "Iniciante",
          days: 4,
          equipment: "Academia",
          createdAt: now,
        };

        const user: UserRecord = {
          id,
          passwordHash,
          profile,
          completedSets: {},
          foods: [],
          weights: [],
          workouts: [],
          createdAt: now,
        };

        setStore((currentStore) => ({
          users: [
            ...currentStore.users,
            user,
          ],
          currentUserId: id,
        }));

        return user;
      },

      async login(
        email: string,
        password: string
      ) {
        const passwordHash = await hash(password);

        const user = store.users.find(
          (item) =>
            item.profile.email ===
              email.trim().toLowerCase() &&
            item.passwordHash === passwordHash
        );

        if (!user) {
          throw new Error(
            "E-mail ou senha inválidos."
          );
        }

        setStore((currentStore) => ({
          ...currentStore,
          currentUserId: user.id,
        }));

        return user;
      },

      logout() {
        setStore((currentStore) => ({
          ...currentStore,
          currentUserId: null,
        }));
      },

      completeOnboarding(
        profile: Partial<UserProfile>
      ) {
        updateUser((user) => {
          const updatedProfile = {
            ...user.profile,
            ...profile,
          };

          const weights = user.weights.length
            ? user.weights
            : [
                {
                  id: crypto.randomUUID(),
                  date: new Date().toISOString(),
                  weight:
                    Number(updatedProfile.weight) || 0,
                },
              ];

          return {
            ...user,
            profile: updatedProfile,
            weights,
            workouts:
              buildWorkouts(updatedProfile),
          };
        });
      },

      updateProfile(
        profile: Partial<UserProfile>
      ) {
        updateUser((user) => ({
          ...user,

          profile: {
            ...user.profile,
            ...profile,
          },
        }));
      },

      toggleSet(
        exerciseId: string,
        setNo: number
      ) {
        updateUser((user) => {
          const key = `${exerciseId}:${setNo}`;

          const next = {
            ...user.completedSets,
          };

          if (next[key]) {
            delete next[key];
          } else {
            next[key] = Date.now();
          }

          return {
            ...user,
            completedSets: next,
          };
        });
      },

      addWorkoutCompletion() {
        updateUser((user) => {
          const today =
            new Date()
              .toISOString()
              .slice(0, 10);

          return {
            ...user,

            workouts: user.workouts.map(
              (workout) =>
                workout.date === today
                  ? {
                      ...workout,
                      completed: true,
                    }
                  : workout
            ),
          };
        });
      },

      addFood(
        entry: Omit<
          FoodEntry,
          "id" | "date"
        >
      ) {
        updateUser((user) => ({
          ...user,

          foods: [
            ...user.foods,

            {
              ...entry,
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
            },
          ],
        }));
      },

      removeFood(id: string) {
        updateUser((user) => ({
          ...user,

          foods: user.foods.filter(
            (food) => food.id !== id
          ),
        }));
      },

      addWeight(weight: number) {
        if (!weight || weight <= 0) {
          return;
        }

        updateUser((user) => ({
          ...user,

          profile: {
            ...user.profile,
            weight,
          },

          weights: [
            ...user.weights,

            {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              weight,
            },
          ],
        }));
      },

      resetData() {
        updateUser((user) => ({
          ...user,

          foods: [],

          weights: [],

          completedSets: {},

          workouts:
            buildWorkouts(user.profile),
        }));
      },
    }),

    [store, current, ready]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
    </Ctx.Provider>
  );
}

export function useNeurofit() {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error(
      "useNeurofit must be used inside NeurofitProvider"
    );
  }

  return context;
}

function buildWorkouts(
  profile: UserProfile
): Workout[] {
  const today = new Date()
    .toISOString()
    .slice(0, 10);

  const split =
    profile.goal === "Emagrecer"
      ? [
          "Full Body A",
          "Full Body B",
        ]
      : [
          "Peito + Tríceps",
          "Costas + Bíceps",
          "Pernas + Ombros",
          "Full Body",
        ];

  return split
    .slice(
      0,
      Math.max(
        2,
        Math.min(4, profile.days || 4)
      )
    )
    .map((title, index) => ({
      id: `w-${index}`,

      title,

      muscle: title.includes("Peito")
        ? "Peito + Tríceps"
        : title.includes("Costas")
        ? "Costas + Bíceps"
        : title.includes("Pernas")
        ? "Pernas + Ombros"
        : "Corpo inteiro",

      duration: 45 + index * 5,

      exercises:
        index % 3 === 0
          ? [
              "supino",
              "triceps",
              "rosca",
            ]
          : index % 3 === 1
          ? [
              "puxada",
              "remada",
              "rosca",
            ]
          : [
              "agachamento",
              "supino",
              "triceps",
            ],

      completed: false,

      date:
        index === 0
          ? today
          : new Date(
              Date.now() +
                index * 86400000
            )
              .toISOString()
              .slice(0, 10),
    }));
}