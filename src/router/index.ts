import { createRouter, createWebHistory } from "vue-router";

import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import ProloguePage from '../views/ProloguePage.vue';
import PuzzlesPage from '../views/PuzzlesPage.vue';
import PrefacePage from '../views/PrefacePage.vue';
import MainPage from '../views/MainPage.vue';

const routes = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: "/start",
        component: LoginPage
    },
    {
        path: "/prologue",
        component: ProloguePage
    },
    {
        path: "/puzzles",
        component: PuzzlesPage
    },
    {
        path: "/preface",
        component: PrefacePage
    },
    {
        path: "/main",
        component: MainPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;