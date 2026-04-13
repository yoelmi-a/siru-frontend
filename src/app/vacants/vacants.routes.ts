import { Routes } from "@angular/router";
import { VacantsLayout } from "./layouts/vacants-layout/vacants-layout";
import { VacantsPage } from "./pages/vacants-page/vacants-page";
import { PostulationsPage } from "./pages/postulations-page/postulations-page";

export const VacantsRoutes: Routes = [
  {
    path: '',
    component: VacantsLayout,
    children: [
      {
        path: '',
        component: VacantsPage
      },
      {
        path: 'postulations',
        component: PostulationsPage
      }
    ]
  }
]

export default VacantsRoutes;
