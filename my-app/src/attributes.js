var ATTRIBUTES_BASIC = [
    "align-content",
    "align-items",
    "align-self",
    "background",
    "background-attachment",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size",
    "border",
    "bottom",
    "direction",
    "display",
    "flex-direction",
    "float",
    "font",
    "height",
    "justify-content",
    "left",
    'cursor',
    'color',
    'right',
    "margin",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "opacity",
    "overflow",
    "overflow-x",
    "overflow-y",
    "padding",
    "position",
    "text-align",
    "top",
    "vertical-align",
    "visibility",
    "width",
    "word-break",
    "word-spacing",
    "word-wrap",
    "z-index"
]

var CSS_ATTRIBUTE = "css"
var ELEMENT_ATTRIUBTE = "js"

var CSS_TEXT = 
`
.mainWindow{
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    display: grid;
    position: relative;
  }
  
  .mainWindow > .element--flex{
    position: relative;
    overflow-x: clip;
  }
  
  .element--flex {
    display: flex;
  }
  
  .element--componentPanel{
    cursor: pointer;
    padding: 10px;
  }
  
  .element--propertyMainPanel{
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .element--propertyElementList{
    display: flex;
    flex-direction: column;
  }
  
  .element--propertyElementList > div {
    padding-bottom: 10px;
    margin-bottom: 10px;
    display: flex;
    height: 30px;
  }
  
  .element--propertyElementList > div label {
    margin-right: 10px;
    width: 100px;
  }
  
  .element--propertyElementList > div input{
    width: 90px;
  }
  
  body{
    overflow: hidden !important;
  }
  
  .element--objectsList{
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
  }
  
  .element--addBackground{
    background: url("./images/addBackground.png") !important;
    background-size: cover !important;
  }
  
  .element--slider * {
    max-height: 100%;
    height: 100%;
  }
  
  .element--slider img {
    object-fit: cover;
  }
`

export default {ATTRIBUTES_BASIC, CSS_ATTRIBUTE, ELEMENT_ATTRIUBTE, CSS_TEXT}