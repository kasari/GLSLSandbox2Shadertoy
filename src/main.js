const $src = document.querySelector(".glsl-sandbox")
const $dst = document.querySelector(".shadertoy")

var GLSLSandboxEditor = ace.edit($src);
GLSLSandboxEditor.session.setMode("ace/mode/glsl");
GLSLSandboxEditor.setTheme("ace/theme/twilight");

var ShadertoyEditor = ace.edit($dst);
ShadertoyEditor.session.setMode("ace/mode/glsl");
ShadertoyEditor.setTheme("ace/theme/twilight");
ShadertoyEditor.setReadOnly(true);

GLSLSandboxEditor.session.on('change', (delta) => {
  const src = GLSLSandboxEditor.getValue()
  const lines = src.split('\n')

  // uniform 文の削除
  let newLines = lines.filter(l => !l.includes("uniform"))

  let dst = newLines.join('\n')

  // main 関数の置換
  dst = dst.replace(/void\s+main.+\)/g, "void mainImage( out vec4 fragColor, in vec2 fragCoord )")

  // GLSLSandbox: uniform vec2 resolution;
  // Shadertoy:   uniform vec3 iResolution;
  // GLSLSandbox と Shardertoy で型が異なるため、一度明示的な実装に置き換えた後に変数名を置換する
  dst = dst.replace(/resolution([^\.])/g, "resolution.xy$1")
  dst = dst.replace(/resolution/g, "iResolution")

  // GLSLSandbox: uniform vec2 mouse;
  // Shadertoy:   uniform vec4 iMouse;
  dst = dst.replace(/mouse([^\.])/g, "mouse.xy$1")
  dst = dst.replace(/mouse/g, "iMouse")

  dst = dst.replace(/time/g, "iTime")

  // gl_FragCoord -> fragCoord
  // gl_FragColor -> fragColor
  dst = dst.replace(/gl_F/g, "f")

  ShadertoyEditor.setValue(dst);
})
