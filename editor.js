var Editor = window.open();
Editor.Store = Store;
Store.db.observable.on("update", function(){
  Editor.setTimeout(function(){
    Editor.set()
  }, 0)
})

html = "<html>";
html += "<head>";
html += "</head>";
html += "<body>";
html += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.5.7/jsoneditor.css"></style>';
html += '<div id="jsoneditor" style="width: 100%; height: 100%;"></div>';
html += '</body></html>';
Editor.document.body.innerHTML = html;

Editor.$ = this.$
Editor.setTimeout(function(){
  Editor.$.get("https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/5.5.7/jsoneditor.js").then(function(){

    // create the editor
    var shouldUpdate = true
    var container = Editor.document.getElementById("jsoneditor");

    var options = {onChange: function(){
      var data = editor.get()
      shouldUpdate = false
      Object.keys(data).forEach(function(key){
        Store(key).set(data[key])
      })
      setTimeout(function(){
        shouldUpdate = true
      }, 2000)
    }};
    var editor = new JSONEditor(container, options);

    Editor.set = function(data){
      if(shouldUpdate){
        editor.set($.extend(true, {}, {}, Store.db.data))
      }
    }

  })

}, 0)
