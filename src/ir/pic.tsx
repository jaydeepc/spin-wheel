import type { ComponentProps } from 'react'
import { Pic as KitPic } from '../keynote/kit/pic'
import { pad } from './deck'

/** The URL of one of slide n's own pictures: public/ir/src/NN/<name>. */
export const pic = (n: number, name: string) => `/ir/src/${pad(n)}/${name}`

/** The URL of a GENERATED picture of slide n: public/ir/gen/NN/<name>. */
export const gen = (n: number, name: string) => `/ir/gen/${pad(n)}/${name}`

/** The kit's <Pic>, reading `n` and `name` from /ir's own pictures. */
export function Pic({ n, name, src, ...rest }: ComponentProps<typeof KitPic>) {
  return <KitPic {...rest} src={src ?? (n && name ? pic(n, name) : '')} />
}
