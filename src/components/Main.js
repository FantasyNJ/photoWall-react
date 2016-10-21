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

// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         <img src={yeomanImage} alt="Yeoman Generator" />
//         <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
//       </div>
//     );
//   }
// }
//
// AppComponent.defaultProps = {
// };
//
// export default AppComponent;

var AppComponent = React.createClass({
  render : function(){
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="nav"></nav>
      </section>
    );
  }
})

module.exports = AppComponent;
