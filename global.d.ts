import { type AxiosStatic } from 'axios';

declare global {
  interface Window {
    axios: AxiosStatic;
    $: JQueryStatic;
    gsap: any;
    Power1: any;
  }
}
