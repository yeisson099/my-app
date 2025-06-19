import { Rubik, Noto_Serif_TC } from 'next/font/google'

export const rubik = Rubik({ 
    subsets: ['latin'], 
    weight: ['300', '400', '500'] ,
    variable: '--font-inter'
})

export const noto = Noto_Serif_TC({
    subsets: ['latin'],
    weight: ['900'],
    variable: '--font-noto'
})