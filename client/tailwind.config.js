/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}","./public/index.html"],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif;']
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman'
    },
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131',
        overlay: 'rgba(0,0,0,0.8)'
      },
      colors: {
        main: '#ee3131'
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(40px);',
                    transform: 'translateY(40px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px);',
                    transform: 'translateY(0px);'
          }
        },
        'slide-top-sm': {
          '0%': {
            '-webkit-transform': 'translateY(8px);',
                    transform: 'translateY(8px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px);',
                    transform: 'translateY(0px);'
          }
        },
        'slide-right': {
          '0%': {
            '-webkit-transform': 'translateX(-1000px)',
                    transform: 'translateX(-1000px)'
          },
          '100%': {
            '-webkit-transform': 'translateX(0px)',
                    transform: 'translateX(0px)'
          }
        },
        'slide-fwd-center': {
          '0%': {
            '-webkit-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',
          },
          '100%': {
            '-webkit-transform': 'translateZ(160px)',
                    'transform': 'translateZ(160px)',
          }
        }
        
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm': 'slide-top-sm 0.3s linear both;',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-fwd-center': 'slide-fwd-center 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("@tailwindcss/forms")({
      strategy: 'class', // only generate classes
    }),
  ],
  
}