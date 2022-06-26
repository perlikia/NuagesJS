import './App.css';
import React from 'react';
import attributes from "./attributes";
import "jquery"
import { getJSON } from 'jquery';

var BOOLEAN = "bool"
var STRING = "string"
var NUMBER = "number"
var INT = "int"
var flagClick = false

var CSS_TEXT = attributes.CSS_TEXT
var ATTRIBUTES_BASIC = attributes.ATTRIBUTES_BASIC;
var CSS_ATTRIBUTE = attributes.CSS_ATTRIBUTE
var ELEMENT_ATTRIUBTE = attributes.ELEMENT_ATTRIUBTE
var IMAGE_ATTRIBUTES = ["src"]
var TEXT_ATTRIBUTES = ["text"]
var SLIDER_IMAGE_ATTRIBUTE = ["imageSRC"]
var SLIDER_ATTRIBUTES = [
  "accessibility", 
  "adaptiveHeight", 
  "autoplay", 
  "autoplaySpeed", 
  "arrows", 
  "centerMode",
  "centerPadding",
  "cssEase",
  "dots",
  "draggable",
  "focusOnSelect",
  "edgeFriction",
  "speed",
  'slidesToShow',
  "swipe",
  "zIndex"
]

var SLIDER_ATTRIBUTES_TYPES = {
  "accessibility": BOOLEAN, 
  "adaptiveHeight": BOOLEAN, 
  "autoplay": BOOLEAN, 
  "autoplaySpeed": INT, 
  "arrows": BOOLEAN, 
  "centerMode": BOOLEAN,
  "centerPadding": STRING,
  "cssEase": STRING,
  "dots": BOOLEAN,
  "draggable": BOOLEAN,
  "focusOnSelect": BOOLEAN,
  "edgeFriction": NUMBER,
  "speed": INT,
  'slidesToShow': INT,
  'slidesToScroll': INT,
  "swipe": BOOLEAN,
  "zIndex": INT
}

const AppContext = React.createContext({});

function getCSSText(style){

  var str = ""

  style.map((value, index) => {
    if(value["type"] == CSS_ATTRIBUTE){
      str += value["attributeName"] + ": " + value["attributeValue"] + ";"
    }
  });

  return str

}

function insertStylesByDict(element, style){
  element.style.cssText = getCSSText(style)
}

var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

function deleteElementFromContainer(container, id){
  let newContainer = []

  container.map((value, index) => {
    if(value.uniqueId == id){
      if(value.children.length != 0){
        alert("Удаление невозможно. У элемента есть потомки")
        newContainer.push(value)
      }
    }
    else if(value.children.length > 0){
      newContainer.push(value)
      value.children = deleteElementFromContainer(value.children, id)
    }
    else{
      newContainer.push(value)
    }
  })
  return newContainer
}

var findElementFromComponentById = function (container, id) {
  var findValue = null
  container.map((value, index) => {
    if(value.uniqueId == id){
      findValue = value;
    }
    else if(value.children.length > 0){
      findValue = findElementFromComponentById(value.children, id)
    }
  })
  return findValue;
}

var findElementsFromComponentByClass = function (container, classType) {
  var components = []

  container.map((value, index) => {
    if(value.class == classType){
      components.push(value)
    }
    else if(value.children.length > 0){
      components.concat(findElementsFromComponentByClass(value.children, classType))
    }
  })

  return components;
}

function updateAttributesElementFromComponentsById(container, element){

  container.map((value, index) => {
    if(value.uniqueId == element.uniqueId){
      value.attributes = element.attributes
    }
    else if(value.children.length > 0){
      updateAttributesElementFromComponentsById(value.children, element)
    }
  })

  return container
}

var insertInComponents = function (container, parentId, elem) {

  let attributesList = []

  elem.class.defaultProps.attributes.map((value, index) => {
    attributesList.push({
      "attributeName": value["attributeName"],
      "attributeValue": value["attributeValue"],
      "type": value["type"]
    })
  })

  container.map((value, index) => {
    if(value.uniqueId == parentId){
      if(value.class.canHaveChildren == true){
        //elem.parent = value
        value.children.push(elem)
      }
    }
    else if(value.children.length > 0){
      insertInComponents(value.children, parentId, elem)
    }
  })

  return container
}

function preRender(classObj, attributes, key, id, children=[]){
  if(classObj == TextSpan){
    return <TextSpan attributes={attributes} key={key} uniqueId={id}></TextSpan>
  }
  if(classObj == FlexComponent){
    return <FlexComponent attributes={attributes} key={key} uniqueId={id} children={children}></FlexComponent>
  }
  if(classObj == TextInputComponent){
    return <TextInputComponent attributes={attributes} key={key} uniqueId={id}></TextInputComponent>
  }
  if(classObj == ImageComponent){
    return <ImageComponent attributes={attributes} key={key} uniqueId={id}></ImageComponent>
  }
  if(classObj == TextBlock){
    return <TextBlock attributes={attributes} key={key} uniqueId={id}></TextBlock>
  }
  if(classObj == H1Element){
    return <H1Element attributes={attributes} key={key} uniqueId={id}></H1Element>
  }
  if(classObj == SliderComponent){
    return <SliderComponent attributes={attributes} key={key} uniqueId={id}></SliderComponent>
  }
}

class TextSpan extends React.Component {

  static name = "Span"

  static allAttributes = [...TEXT_ATTRIBUTES, ...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = false;

  constructor(props){
    super(props)

    this.state = {
      id: props.uniqueId,
      attributes: props.attributes
    }
  }

  componentDidMount(){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  render(){    
    let text = this.getJsAttributeByName("text")

    return <AppContext.Consumer>
      {({setPropertyElement}) => (
        <span className='element--textSpan element--border' id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}>{text != false ? text.attributeValue : ""}</span>
      )}
    </AppContext.Consumer>
  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  getJsAttributeByName(findName){
    var obj = false
    this.state.attributes.map((value, index) => {
      if(value.type == ELEMENT_ATTRIUBTE && value.attributeName == findName){
        obj = value
      }
    })
    return obj
  }

}

class H1Element extends React.Component {

  static name = "H1"

  static allAttributes = [...TEXT_ATTRIBUTES, ...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = false;

  constructor(props){
    super(props)

    this.state = {
      id: props.uniqueId,
      attributes: props.attributes
    }

  }

  componentDidMount(){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  render(){    

    let text = this.getJsAttributeByName("text")

    return <AppContext.Consumer>
      {({setPropertyElement}) => (
        <h1 className='element--textH1 element--border' id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}>{text != false ? text.attributeValue : ""}</h1>
      )}
    </AppContext.Consumer>
  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  getJsAttributeByName(findName){
    var obj = false
    this.state.attributes.map((value, index) => {
      if(value.type == ELEMENT_ATTRIUBTE && value.attributeName == findName){
        obj = value
      }
    })
    return obj
  }

}

class TextBlock extends React.Component {

  static name = "Параграф"

  static allAttributes = [...TEXT_ATTRIBUTES, ...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = false;

  constructor(props){
    super(props)

    this.state = {
      id: props.uniqueId,
      attributes: props.attributes
    }
  }

  componentDidMount(){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  render(){    

    let text = this.getJsAttributeByName("text")

    return <AppContext.Consumer>
      {({setPropertyElement}) => (
        <p className='element--textBox element--border' id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}>{text != false ? text.attributeValue : ""}</p>
      )}
    </AppContext.Consumer>
  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  getJsAttributeByName(findName){
    var obj = false
    this.state.attributes.map((value, index) => {
      if(value.type == ELEMENT_ATTRIUBTE && value.attributeName == findName){
        obj = value
      }
    })
    return obj
  }

}

class TextInputComponent extends React.Component {
  static name = "Text input"

  static allAttributes = [...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = false;

  constructor(props){
    super(props)

    this.state = {
      id: props.uniqueId,
      attributes: props.attributes
    }

  }

  componentDidMount(){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  render(){
    return <AppContext.Consumer>
      {({setPropertyElement}) => (
        <input id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}></input>
      )}
    </AppContext.Consumer>
  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  getJsAttributeByName(findName){
    var obj = false
    this.state.attributes.map((value, index) => {
      if(value.type == ELEMENT_ATTRIUBTE && value.attributeName == findName){
        obj = value
      }
    })
    return obj
  }

}

class SliderComponent extends React.Component {

  static name = "Slider"

  static allAttributes = [...SLIDER_IMAGE_ATTRIBUTE, ...SLIDER_ATTRIBUTES, ...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = false;

  constructor(props){
    super(props)

    this.state = {
      id: props.uniqueId,
      attributes: props.attributes,
    }
    
  }

  componentDidMount(){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
    $("#" + this.state.id + ".slick-initialized").slick("unslick")
    $("#" + this.state.id).html("")
    let imageSRC = this.getJsAttributeByName("imageSRC")
    if(imageSRC != false){
      imageSRC.attributeValue.split(";").map((value, index) => {
        if(value != ""){
          $("#" + this.state.id).append("<img src='"+ value + "'>")
        }
      })
    }
    $("#" + this.state.id).slick()
    this.renderSlider()
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
    $("#" + this.state.id + ".slick-initialized").slick("unslick")
    $("#" + this.state.id).html("")
    let imageSRC = this.getJsAttributeByName("imageSRC")
    if(imageSRC != false){
      imageSRC.attributeValue.split(";").map((value, index) => {
        if(value != ""){
          $("#" + this.state.id).append("<img src='"+ value + "'>")
        }
      })
    }
    $("#" + this.state.id).slick()
    this.renderSlider()
  }

  renderSlider(){

    this.state.attributes.map((value, index) => {
      if(SLIDER_ATTRIBUTES.includes(value.attributeName)){
        $("#" + this.state.id).slick("slickSetOption", value.attributeName, SliderComponent.parseValueFromType(value), true)
      }
    })

  }

  static getSliderOptionsRenderStatesByElement(element){
    var text = "";
    element.attributes.map((value, index) => {
      if(SLIDER_ATTRIBUTES.includes(value.attributeName)){
        text += `$('${"#" + element.uniqueId}').slick("slickSetOption", "${value.attributeName}", ${SliderComponent.parseValueFromType(value)}, true);\n`
      }
    })
    return text
  }

  static parseValueFromType(attribute){
    if(attribute.attributeName in SLIDER_ATTRIBUTES_TYPES){
      var type = SLIDER_ATTRIBUTES_TYPES[attribute.attributeName]
      if(type == INT){
        return parseInt(attribute.attributeValue)
      }
      if(type == BOOLEAN){
        return attribute.attributeValue == "true";
      }
      if(type == NUMBER){
        return parseFloat(attribute.attributeValue)
      }
      if(type == STRING){
        return attribute.attributeValue
      }
    } 
    return attribute.attributeValue
  }

  render(){    
    let images = this.getJsAttributeByName("imageSRC")
    if(images != false){
      return <AppContext.Consumer>
        {({setPropertyElement}) => (
          <div className='element--slider element--border' id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}>
          </div>
        )}
      </AppContext.Consumer>
    }
    else{
      return <AppContext.Consumer>
        {({setPropertyElement}) => (
          <div className='element--slider element--border' id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}>

          </div>
        )}
      </AppContext.Consumer>
    }

  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  getJsAttributeByName(findName){
    var obj = false
    this.state.attributes.map((value, index) => {
      if(value.type == ELEMENT_ATTRIUBTE && value.attributeName == findName){
        obj = value
      }
    })
    return obj
  }

}


class ImageComponent extends React.Component {
  static name = "Изображение"

  static allAttributes = [...IMAGE_ATTRIBUTES, ...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = false;

  constructor(props){
    super(props)

    this.state = {
      id: props.uniqueId,
      attributes: props.attributes
    }

  }

  componentDidMount(){
    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  componentDidUpdate(prevProps, prevState, snapshot){

    insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
  }

  render(){

    let src = this.getJsAttributeByName("src")

    return <AppContext.Consumer>
      {({setPropertyElement}) => (
        <img id={this.state.id} src={src != false ? src.attributeValue : ""} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}></img>
      )}
    </AppContext.Consumer>
  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  getJsAttributeByName(findName){
    var obj = false
    this.state.attributes.map((value, index) => {
      if(value.type == ELEMENT_ATTRIUBTE && value.attributeName == findName){
        obj = value
      }
    })
    return obj
  }

}

class FlexComponent extends React.Component {

  static name = "Flex box"

  static allAttributes = [...ATTRIBUTES_BASIC]

  static contextType = AppContext;

  static canHaveChildren = true;

  constructor(props){
    super(props)
    this.state = {
      id: props.uniqueId,
      children: props.children,
      attributes: props.attributes
    }

  }

  componentDidMount(){
    if(this.state.id == this.context.nodeComponentId){

    }
    else{
      insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.id == this.context.nodeComponentId){

      if(this.context.components.length != this.state.children.length){
        this.setState(state => ({
          children: this.context.components
        }))
      }

    }
    else{
      insertStylesByDict(document.querySelector("#" + this.state.id), this.state.attributes)
      let realChildren = findElementFromComponentById(this.context.components, this.state.id)
      if(realChildren == undefined){
        realChildren = {
          "children": []
        }
      }
      else if(this.state.children.length != realChildren.children.length){
        this.setState(state => ({
          children: realChildren.children
        }))
      }
    }
  }

  openProperties(setPropertyEvent){
    if(!flagClick){
      flagClick = true
      let component = findElementFromComponentById(this.context.components, this.state.id)
      if(component){
        setPropertyEvent(component);
      }
      setTimeout(()=>{
        flagClick = false
      }, 500)
    }
  }

  render(){
    const children = this.state.children
    var list = children.map((value, index) => {
      let result = preRender(value.class, value.attributes, index, value.uniqueId, value.children)  
      return result
    })

    let appendedClasses = "element--flex element--border"

    if(this.context.drag){
      appendedClasses += " element--addBackground"
    }

    if(this.context.nodeComponentId == this.state.id){
      return <div className={appendedClasses} id={this.state.id}>{
        list
      }</div>
    }
    else{
      return <AppContext.Consumer>
        {({setPropertyElement}) => (
          <div className={appendedClasses} id={this.state.id} onClick={(event)=>{event.preventDefault();this.openProperties(setPropertyElement)}}>{
            list
          }</div>
        )}
      </AppContext.Consumer>
    }
  }
}

class ObjectInPanel extends React.Component {

  static contextType = AppContext

  constructor(props){
    super(props)
    this.state = {
      background: "initial",
      value: props.name,
      classComponent: props.classComponent,
    }
  }

  hover(){
    if(!this.context.drag){
      this.setState({
        background: "black"
      });
    }
  }

  blur(){
    if(!this.context.drag){
      this.setState({
        background: "initial"
      });
    }
  }

  dragStart(){
    this.setState({
      dragComponent: this.state.classComponent
    })
  }

  dragEnd(event){
    let element = document.elementFromPoint(event.pageX, event.pageY)

    let attributesList = []

    this.state.classComponent.defaultProps.attributes.map((value, index) => {
      attributesList.push({
        "attributeName": value["attributeName"],
        "attributeValue": value["attributeValue"],
        "type": value["type"]
      })
    })

    if(element.id != ""){
      if(element.id == this.context.nodeComponentId){

        let elem = {
          uniqueId: ID(),
          //parent: null,
          class: this.state.classComponent,
          attributes: attributesList,
          children: []
        }
        this.context.components.push(elem)
        this.context.setComponents(this.context.components)
        this.context.setPropertyElement(elem)
      }
      else if(document.querySelector("#" + this.context.nodeComponentId).querySelector("#" + element.id) == element){
        let elem = {
          uniqueId: ID(),
          //parent: null,
          class: this.state.classComponent,
          attributes: attributesList,
          children: []
        }

        this.context.setComponents(
          insertInComponents(this.context.components, element.id, elem)
        ) 
        this.context.setPropertyElement(elem)
      }
    }

    this.setState({
      dragComponent: null
    })
  }

  render(){
    return <AppContext.Consumer>
      {({changeDrag}) => (
        <div className='element--componentPanel' draggable={true} onDragStart={()=>{this.dragStart(); changeDrag(true);}} onDragEnd={(event)=>{this.dragEnd(event); changeDrag(false);}} style={{"background": this.state.background}} onMouseEnter={()=>{this.hover()}} onMouseLeave={()=>{this.blur()}}>{this.state.value}</div>
      )}
    </AppContext.Consumer>
  }

}

class ObjectsPanel extends React.Component{

  static contextType = AppContext

  componentsList = [
    {
      "name": "H1",
      "classObj": H1Element
    },
    {
      "name": "Span",
      "classObj": TextSpan
    },
    {
      "name": "Текстовый блок",
      "classObj": TextBlock
    },
    {
      "name": "Flex Box",
      "classObj": FlexComponent
    },
    {
      "name": "Text input",
      "classObj": TextInputComponent
    },
    {
      "name": "Слайдер",
      "classObj": SliderComponent
    },
    {
      "name": "Изображение",
      "classObj": ImageComponent
    }
  ]

  constructor(props){
    super(props)
    this.state = {
      panelBackground: props.panelBackground,
      panelColor: props.panelColor,
    }
  }

  getUpload(){
    var htmlRoot = $(".mainWindow > .element--flex.element--border");
    var doc = `
    <html>
    <head>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
    </head>
    <body>{htmlContent}{outerContent}</body>
    </html>`;

    //doc = doc.replace("{htmlContent}", htmlText)
    var scripts = ""
    var sliderElements = findElementsFromComponentByClass(this.context.components, SliderComponent);


    sliderElements.map((value, index) => {
      scripts += "\n<script>\n"
      scripts += "window.addEventListener('load', (event) => {\n"
      scripts += `  $("${"#" + value.uniqueId}").slick();\n`
      scripts += "  " + SliderComponent.getSliderOptionsRenderStatesByElement(value) + "\n"
      scripts += "\n});"
      scripts += "</script>\n"
    })

    scripts += `<style>${CSS_TEXT}</style>`

    doc = doc.replace("{outerContent}", scripts)

    var htmlText = this.getElementsTextByRoot(htmlRoot);

    doc = doc.replace("{htmlContent}", htmlText)

    var element = document.querySelector("#uploadLink")
    const fileHTML = new Blob([doc], {
      type: "text/html",
    });

    element.href = URL.createObjectURL(fileHTML);
    element.download = "upload.html";   
    element.click()
  }

  getElementsTextByRoot(root){
    var text = ""
    if(root.hasClass("element--slider")){
      text += `<div class="element--slider element--border" id="${root.attr("id")}" style="${root.attr("style")}">\n`
      var images = $("#" + root.attr("id") + " .slick-slide:not(.slick-cloned)")
      images.map((index, value) => {
        text += `<img src="${$(value).attr("src")}">\n`
      })
      text += "</div>\n"
    }
    else if(root.hasClass("element--flex")){
      text += `<div class="element--flex element--border" id="${root.attr("id")}"  style="${root.attr("style")}">\n`
      root.children().map((index, value) => {
        text += this.getElementsTextByRoot($(value))
      })
      text += "</div>\n"
    }
    else{
      text += root[0].outerHTML
      text += "\n"
    }

    return text
  }

  render(){
    return <div className='element--objectsList' style={{"color": this.state.panelColor, "background": this.state.panelBackground}}>
      <div>
      {this.componentsList.map((value, index) => {
        return <ObjectInPanel key={index} name={value.name} classComponent={value.classObj} ></ObjectInPanel>
      })}
      </div>
      <button style={{"margin": "5px"}} onClick={()=>{this.getUpload()}}>Выгрузить страницу</button>
      <a id='uploadLink' style={{"display": "none"}} ></a>
    </div>
  }

}

class SitePanel extends React.Component{

  static contextType = AppContext

  constructor(props){
    super(props)
  }

  render(){
    const children = this.context.components
    return <FlexComponent children={children} uniqueId={this.context.nodeComponentId} width="100%"></FlexComponent>
  }

}

class PropertyPanel extends React.Component{

  static contextType = AppContext

  constructor(props){
    super(props)
    this.state = {
      panelBackground: props.panelBackground,
      panelColor: props.panelColor
    }
  }

  render(){
    if(this.context.propertyElement){
      let elem = this.context.propertyElement;

      return <AppContext.Consumer>
        {({setComponents, setPropertyElement}) => (
          <div className="element--propertyMainPanel" style={{"color": this.state.panelColor, "background": this.state.panelBackground}}>
          <h2>{elem.class.name}</h2>
          <div className='element--propertyElementList'>
            {elem.class.allAttributes.map((value, index) => {
              return <div key={index}>
                <label>{value}</label>
                <input type="text" onInput={(event)=>{this.setAttributeValue(event, value, setComponents, elem.uniqueId, elem.class)}} value={this.findAttributeValue(value, elem.attributes)} ></input>
              </div>
            })}
          </div>
          <button onClick={()=>{setComponents(deleteElementFromContainer(this.context.components, elem.uniqueId)); setPropertyElement(null)}}>Удалить элемент</button>
        </div>
        )}
      </AppContext.Consumer>
    }
    else{
      return <div style={{"color": this.state.panelColor, "background": this.state.panelBackground}}></div>
    }    
  }

  findAttributeValue(attributeName, attributes){
    let val = ""

    attributes.map((value, index) => {
      if(value["attributeName"] == attributeName){
        val = value["attributeValue"]
      }
    })

    return val;
  }

  setAttributeValue(event, attributeName, changeAttributesEvent, elementId, elementClass){
    let find = false

    let element = findElementFromComponentById(this.context.components, elementId)

    element.attributes.map((mapValue, mapIndex) => {
      if(mapValue["attributeName"] == attributeName){
        find = true
        mapValue["attributeValue"] = event.target.value
      }
    })

    if(!find){
      element.attributes.push({
        attributeName: attributeName,
        attributeValue: event.target.value,
        type: ATTRIBUTES_BASIC.includes(attributeName) ? CSS_ATTRIBUTE : ELEMENT_ATTRIUBTE
      })
    }

    changeAttributesEvent(updateAttributesElementFromComponentsById(this.context.components, element))
  }

}

class App extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      nodeComponentId: ID(),
      drag: false,
      components: [],
      changeDrag: (val) => {
        this.setState(state => ({
          drag: val
        }));
      },
      setComponents: (container) => {
        this.setState(state => ({
          components: container
        }));
      },
      setPropertyElement: (value) => {
        this.setState(state => ({
          propertyElement: value
        }));
      },
    }
  }

  render(){
    let sitePanelWidth = parseInt(document.body.clientWidth - 300 - 300).toString();
    var templateColumns = "300px " + sitePanelWidth + "px " + "300px";
    
    return <div className='mainWindow' style={{"gridTemplateColumns": templateColumns, "background": "white"}}>
      <AppContext.Provider value={this.state}>
        <ObjectsPanel></ObjectsPanel>
        <SitePanel></SitePanel>
        <PropertyPanel></PropertyPanel>
      </AppContext.Provider>
    </div>
  }

}

PropertyPanel.defaultProps = {
  panelBackground: "gray",
  panelColor: "white"
}

ObjectsPanel.defaultProps = {
  panelBackground: "gray",
  panelColor: "white"
}

TextInputComponent.defaultProps = {
  attributes: [
    {
      "attributeName": "width",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}

H1Element.defaultProps = {
  attributes: [
    {
      "attributeName": "text",
      "attributeValue": "H1 element",
      "type": ELEMENT_ATTRIUBTE
    },
    {
      "attributeName": "width",
      "attributeValue": "100%",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "height",
      "attributeValue": "20px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}


TextSpan.defaultProps = {
  attributes: [
    {
      "attributeName": "text",
      "attributeValue": "Text span element",
      "type": ELEMENT_ATTRIUBTE
    },
    {
      "attributeName": "width",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}

FlexComponent.defaultProps = {
  attributes: [
    {
      "attributeName": "width",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}

SliderComponent.defaultProps = {
  attributes: [
    {
      "attributeName": "width",
      "attributeValue": "100%",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "height",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}

ImageComponent.defaultProps = {
  attributes: [
    {
      "attributeName": "width",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "height",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}

TextBlock.defaultProps = {
  attributes: [
    {
      "attributeName": "text",
      "attributeValue": "Text block",
      "type": ELEMENT_ATTRIUBTE
    },
    {
      "attributeName": "height",
      "attributeValue": "100px",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "width",
      "attributeValue": "100%",
      "type": CSS_ATTRIBUTE
    },
    {
      "attributeName": "background",
      "attributeValue": "white",
      "type": CSS_ATTRIBUTE
    }
  ]
}

export default App;