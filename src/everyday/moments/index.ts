/**
 * The registry: one module per product moment, in no particular order
 * (the film's order is PRODUCTS in content.ts).
 */

import type { ProductKey } from '../content'
import byoa from './byoa'
import byot from './byot'
import mind from './mind'
import prastuti from './prastuti'
import smarthelp from './smarthelp'
import type { MomentModule } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MOMENTS: Record<ProductKey, MomentModule<any>> = { smarthelp, byot, byoa, prastuti, mind }
