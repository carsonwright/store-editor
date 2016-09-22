
var Editor = {};
Store.editor = function(){
  Editor = window.open();

  Editor.setDOM = function(){
    var localWindow = this
    html = "<html>";
    html += "<head>";
    html += "</head>";
    html += "<body>";
    html += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.5.7/jsoneditor.css"></style>';
    html += '<div id="jsoneditor" style="width: 100%; height: 100%;"></div>';
    html += '</body></html>';
    this.document.body.innerHTML = html;

    this.$ = this.opener.$

    localWindow.Store = this.opener.Store;
    localWindow.JSONEditor = this.opener.JSONEditor;

    // create the editor

    var shouldUpdate = true
    var container = localWindow.document.getElementById("jsoneditor");

    var options = {onChange: function(){
      var data = localWindow.editor.get()
      shouldUpdate = false
      Object.keys(data).forEach(function(key){
        var sourceJSON = JSON.stringify(localWindow.Store(key).get())
        var targetJSON = JSON.stringify(data[key])
        if(sourceJSON != targetJSON){
          localWindow.Store(key).set(data[key])
        }
      })
      setTimeout(function(){
        shouldUpdate = true
      }, 2000)
    }};
    this.editor = new localWindow.JSONEditor(container, options);

    localWindow.set = function(){
      console.log(shouldUpdate)
      if(shouldUpdate){
        localWindow.editor.set($.extend(true, {}, {}, localWindow.Store.db.data))
      }
    }

    localWindow.Store.db.observable.on("update", function(){
      localWindow.set()
    })

    localWindow.set()
  }

  Editor.setDOM()
  $(window).on("unload", function(){
    this.resetInterval = this.setInterval(function(){
      if(this.Store != this.opener.Store && this.opener.Store){
        this.setDOM();
        this.clearInterval(this.resetInterval);
      }
    }.bind(this), 6000)
  }.bind(Editor))

}.bind(this)
