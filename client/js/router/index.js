import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import LoginSignup from '../views/LoginSignup.vue';
import Lobby from '../views/Lobby.vue';
import GameView from '../views/GameView.vue';
import Rules from '../views/Rules.vue';
import Stats from '../views/Stats.vue';
import store from '../store/store.js';

Vue.use(VueRouter);

<<<<<<< Updated upstream
const mustBeAuthenticated = (to, from, next) => {
  if (store.state.auth.authenticated) {
=======
// Recursive function to run middleware consecutively, index defaults to 1 so it starts pointed
// to the next middleware; the chain will look something like this given the following route meta:
//
// meta: {
//     middleware: [mustBeAuthenticated, gameMustExist],
// }
//
// 1. router.beforeEach
export function runRouteMiddleware(context, middleware, index = 0) {
  const { to, from, next } = context;
  const [currentMiddleware, nextMiddleware] = middleware;

  // If there are no more middlewares to run, just run the current middleware and bail
  if (!nextMiddleware) {
    console.log('Running only current middleware', index);
    return currentMiddleware(to, from, next);
  }

  // If there are subsequent middleware to run, do those first then queue up the next onee
  return (...params) => {
    // Run the current middleware first
    console.log('Running current middleware', index, params);
    currentMiddleware(...params);
    // Then call this function again with the next middleware in the chain
    nextMiddleware({
      ...context,
      // set the next middleware next() function to the middleware after next
      next: runRouteMiddleware(context, middleware, index + 1),
    });
  };
}

function mustBeAuthenticated(to, from, next) {
  console.log('checking auth status');
  if (store.getters.authenticated) {
>>>>>>> Stashed changes
    return next();
  }
  return next('/login');
}

<<<<<<< Updated upstream
=======
async function logoutAndRedirect(to, from, next) {
  await store.dispatch('requestLogout');
  return next('/login');
}

function gameMustExist(to, from, next) {
  return next();
}

function lobbyMustExist(to, from, next) {
  return next();
}

>>>>>>> Stashed changes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      middleware: mustBeAuthenticated,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginSignup,
  },
<<<<<<< Updated upstream
=======
  // This route is just a passthrough to make sure the user is fully logged out before putting
  // them on the login screen
  {
    path: '/logout',
    name: 'Logout',
    meta: {
      middleware: logoutAndRedirect,
    },
  },
>>>>>>> Stashed changes
  {
    path: '/rules',
    name: 'Rules',
    component: Rules,
  },
  {
    name: 'Lobby',
    path: '/lobby/:gameId',
    component: Lobby,
<<<<<<< Updated upstream
=======
    meta: {
      middleware: [mustBeAuthenticated, lobbyMustExist],
    },
>>>>>>> Stashed changes
  },
  {
    name: 'Game',
    path: '/game/:gameId',
    component: GameView,
    meta: {
      requiresAuth: true,
      middleware: [mustBeAuthenticated, gameMustExist],
    },
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
<<<<<<< Updated upstream
    beforeEnter: mustBeAuthenticated,
=======
    meta: {
      middleware: mustBeAuthenticated,
    },
>>>>>>> Stashed changes
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // If we have any middleware we need to run, we should do it first
  // https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields
  if (to.meta.middleware) {
    // We support either a singlee middleware, or multiple middlewars (in order)
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];
    const context = {
      to,
      from,
      next,
    };
    console.log('Calling middlewares', context, middleware);
    return runRouteMiddleware(context, middleware);
  }

  // Otherwise continue processing the request
  return next();
});

export default router;
