/// <reference types="axios" />

import { type AxiosStatic } from 'axios';
import { type gsap } from 'gsap';
import { type StreamelementsAPI } from './src/interfaces/other.interface';

declare global {
  const axios: AxiosStatic;
  const $: JQueryStatic;
  const gsap: gsap;
  const Power1: gsap.Ease;

  const SE_API: StreamelementsAPI;
}
