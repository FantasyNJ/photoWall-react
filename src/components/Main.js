require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片数据
let imageDatas = require('../data/imageDatas.json');

//将图片路径名信息转成图片
imageDatas = (function(imageDatasArr){
  imageDatasArr.forEach(function(item){
    let singleImageData = item;
    singleImageData.imageUrl = require('../images/' + item.fileName );
    item = singleImageData;
  });
  return imageDatasArr;
})(imageDatas)

//获取取值范围内的随机数
function getRandomNum(s, e){
  return Math.floor(Math.random()*(e-s)+s);
}
//获取 -30～+30 之间的随机数（旋转角度）
function getRandomDeg(){
  let deg = Math.floor(Math.random()*31);
  return (Math.random() - 0.5) > 0 ? deg : -deg;
}


//每张图片模块
var ImageFigure = React.createClass({
  clickHandler : function(e){
    if(this.props.dataPos.isCenter){   //如果是居中图片，翻转
      this.props.reverse();
    }else{   //如果不是居中图片，居中
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },
  render : function(){
    var imgStyle = null;    //图片样式
    //如果有位置信息并且不为0
    if(this.props.dataPos.pos){
      imgStyle = this.props.dataPos.pos;
    }
    //如果有旋转角度并且不为0
    if(this.props.dataPos.rotate){
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(item){
        imgStyle[item] = 'rotate(' + this.props.dataPos.rotate + 'deg)';
      },this)
    }
    //如果图片居中，设置z-index
    if(this.props.dataPos.isCenter){
      imgStyle['zIndex'] = 11;
    }

    var className = 'img-figure' + (this.props.dataPos.isReverse? ' reverse' : '');

    return <figure className={className} style={imgStyle} ref="figure" onClick={this.clickHandler}>
              <img src={this.props.data.imageUrl} title={this.props.data.title} alt={this.props.data.title}/>
              <figcaption>
                <h2 className="img-title">{this.props.data.title}</h2>
                <div className="img-back">
                  <p>{this.props.data.desc}</p>
                </div>
              </figcaption>
            </figure>;
  }
})

//切换导航模块
var NavItem = React.createClass({
  clickHandler : function(e){
    //如果按钮对应的图片是居中的
    if(this.props.dataPos.isCenter){
      this.props.reverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },
  render : function(){
    var className = 'nav-item' + (this.props.dataPos.isCenter? ' select': '') + (this.props.dataPos.isReverse? ' reverse' : '');
    return <span className={className} onClick={this.clickHandler}></span>;
  }
})

var AppComponent = React.createClass({
  //图片位置范围
  position : {
    centerPos: {  //居中图片的取值范围
      left: 0,
      right: 0
    },
    hPosRange: {   // 水平方向的取值范围
      leftSecX: [0, 0],   //左侧范围
      rightSecX: [0, 0],  //右侧范围
      y: [0, 0]            //上防范围
    },
    vPosRange: {    // 垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  },
  /*
   * 翻转图片函数
   * @param index 要翻转的图片
   * @return {Function} 返回闭包函数
   * */
  reverseImg : function(index){
    return function(){
      var imgChangeData = this.state.imgChangeData;
      imgChangeData[index].isReverse = !imgChangeData[index].isReverse;
      this.setState({
        imgChangeData : imgChangeData
      })
    }.bind(this)
  },
  //设置图片位置角度翻转函数
  setImg : function(centerIndex){
    //在此之前imgChangeData中已经有数据了，left和top全为0
    var imgChangeData = this.state.imgChangeData,
      position = this.position,
      centerPos = position.centerPos,
      hPosRange = position.hPosRange,
      vPosRange = position.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x;
    //获取居中图片的数据，居中图片设置rotate市委了点击的时候重置
    var centerImgData = imgChangeData.splice(centerIndex,1);  //返回数组
    centerImgData[0] = {
      pos : centerPos,
      rotate : 0,
      isCenter : true
    }
    //规定上方图片为1张
    var topImgNum = 1,
      topImgIndex = Math.floor(Math.random()*(imgChangeData.length - topImgNum)),
      topImgDatas = imgChangeData.splice(topImgIndex, topImgNum);
    //为上方图片设置位置
    topImgDatas.forEach(function(item, index){
      topImgDatas[index] = {
        pos : {
          top: getRandomNum(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRandomNum(vPosRangeX[0], vPosRangeX[1])
        },
        rotate : getRandomDeg(),
        isCenter : false
      };
    })
    // console.log(topImgDatas[0],topImgDatas[1])
    //设置两侧的图片位置
    for(let i = 0,len = imgChangeData.length,c = len / 2;i < len; i++){
      let hPosRangeX = null; //水平方向的取值范围
      //前半部分布局左边，后半部分布局右边
      if(i <= c){
          hPosRangeX = hPosRangeLeftSecX;
      }else{
          hPosRangeX = hPosRangeRightSecX;
      }
      imgChangeData[i] = {
        pos : {
          top: getRandomNum(hPosRangeY[0], hPosRangeY[1]),
          left: getRandomNum(hPosRangeX[0], hPosRangeX[1])
        },
        rotate : getRandomDeg(),
        isCenter : false
      }
    }
    //为imgChangeData添加上方图片信息
    // topImgDatas.forEach(function(item,index){
    //   imgChangeData.splice(topImgIndex+index,0,topImgDatas[index]);
    // })
    imgChangeData.splice(topImgIndex,0,...topImgDatas);
    //为imgChangeData添加居中图片信息
    imgChangeData.splice(centerIndex,0,centerImgData[0]);

    //设置state重新渲染
    this.setState({
      imgChangeData : imgChangeData
    })

  },
  /*
  * 居中图片函数
  * @param index 所点击图片的index
  * @return {Function}
  * */
  center : function(index){
    return function(){
      this.setImg(index);
    }.bind(this);
  },
  getInitialState : function(){
    return {
      //存储每张图片的位置
      imgChangeData : [/*
        pos:{left:0,top:0},
        rotate : 0,
        isReverse : false,
        isCenter : false
      */]
    }
  },
  render : function(){

    var imageFigures = [],
      navItems = [];

    imageDatas.forEach(function(item,index){
      //如果图片没有位置信息，为其设置默认的位置。在initialState设置值不会重新渲染
      if(!this.state.imgChangeData[index]){
        this.state.imgChangeData[index] = {
          pos : {
            left : 0,
            top : 0
          },
          rotate : 0,
          isReverse : false,  //是否翻转
          isCenter : false    //是否居中
        }
      }
      imageFigures.push(<ImageFigure key={index} data={item} dataPos={this.state.imgChangeData[index]} ref={'imgFig'+index} reverse={this.reverseImg(index)} center={this.center(index)}/>);

      navItems.push(<NavItem key={index} dataPos={this.state.imgChangeData[index]} reverse={this.reverseImg(index)} center={this.center(index)}/>);
    }.bind(this))

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav className="nav">
          {navItems}
        </nav>
      </section>
    );
  },
  //组件加载以后为每张图片计算位置
  componentDidMount : function(){
    //获取整个容器的大小
    var stage = this.refs.stage,
      stageW = stage.scrollWidth,
      stageH = stage.scrollHeight,
      halfStageW = Math.floor(stage.scrollWidth / 2),
      halfStageH = Math.floor(stage.scrollHeight / 2);
    //获取图片容器的大小
    var imageFigureDom = this.refs.imgFig0.refs.figure,
      imgW = imageFigureDom.scrollWidth,
      imgH = imageFigureDom.scrollHeight,
      halfImgW = Math.floor(imageFigureDom.scrollWidth / 2),
      halfImgH = Math.floor(imageFigureDom.scrollHeight / 2);
    //计算上方区域的范围
    this.position.centerPos = {
      left : halfStageW - halfImgW,
      top : halfStageH - halfImgH
    }
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.position.hPosRange.leftSecX[0] = -halfImgW;
    this.position.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.position.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.position.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.position.hPosRange.y[0] = -halfImgH;
    this.position.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.position.vPosRange.topY[0] = -halfImgH;
    this.position.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.position.vPosRange.x[0] = halfStageW - imgW;
    this.position.vPosRange.x[1] = halfStageW;

    //设置第一张图片居中
    this.setImg(0);
  },
})

module.exports = AppComponent;
