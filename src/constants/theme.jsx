import { Dimensions } from "react-native";

const {width, height} = Dimensions.get("screen"); 


export const COLORS = {
    primary: "rgb(24, 61, 135)", 
    orange: "rgb(227, 115, 54)", 
    gray: "rgb(245, 248, 252)", 
    light_blue: "rgb(220, 231, 244)", 
    middle_blue: "rgb(200, 219, 246)",
    other_blue: "rgb(164, 182, 210)",
    other_blue2: "rgb(244, 248, 252)",
    input_blue: "rgb(243, 247, 252)",
    other_blue3: "rgb(70, 128, 230)",
    textInput: "rgb(167, 187, 214)"
}

export const SIZES = {

    h1: height * 0.043, 
    h2: height * 0.033, 
    h3: height * 0.027, 
    h4: height * 0.023, 
    h5: height * 0.02, 
    h6: height * 0.017, 
    h7: height * 0.014,
    h8: height * 0.012,
    width, 
    height
}

export const MONTHS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  export const FONTS = {
    ligth: "AristotelicaProTx-Lt", 
    bold: "AristotelicaProTx-Bld", 
    regular: "AristotelicaProTx-Rg", 
  }

  export const kilos = [
    {label: "5 kilos", value: 5}, 
    {label: "10 kilos", value: 10}, 
    {label: "15 kilos", value: 15}, 
    {label: "20 kilos", value: 20}, 
    {label: "25 kilos", value: 25}, 
    {label: "30 kilos", value: 30}, 
    {label: "35 kilos", value: 35}, 
    {label: "40 kilos", value: 40}, 
    {label: "45 kilos", value: 45}, 
    {label: "50 kilos", value: 50}
  ]

  export const conteneurs = [

    {label: "20 pieds", value: 20}, 
    {label: "40 pieds", value: 40}, 
    {label: "40 pieds Hight", value: 401}, 
    {label: "45 pieds", value: 45}, 
  
  ]