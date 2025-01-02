import { type AxiosStatic } from 'axios';
import { gsap, po } from 'gsap';

declare global {
  const axios: AxiosStatic;
  const $: JQueryStatic;
  const gsap: gsap;
  const Power1: gsap.Ease;
}
