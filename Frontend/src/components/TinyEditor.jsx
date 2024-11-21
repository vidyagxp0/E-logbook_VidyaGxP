import React, { useEffect, useRef, useState } from "react";

export default function TinyEditor({
  editorContent,
  setEditorContent,
  tinyNo,
}) {
  const editorRef = useRef(null);
  const [temp, setTemp] = useState(true);

  // useEffect(() => {
  //   let api_key = " import.meta.env.VITE_OPEN_AI_API_KEY";

  //   // Initialize TinyMCE when the component mounts
  //   if (window.tinymce) {
  //     window.tinymce.init({
  //       target: editorRef.current,
  //       height: 500,
  //       menubar: true,
  //       toolbar:
  //         "undo redo | aidialog aishortcuts | charmap | blocks fontsizeinput | bold italic | align numlist bullist | link | table pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
  //       plugins:
  //         "ai preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown",

  //       ai_request: (request, respondWith) => {
  //         // Handle AI request
  //         const openAiOptions = {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${api_key}`,
  //           },
  //           body: JSON.stringify({
  //             model: "gpt-3.5-turbo",
  //             temperature: 0.7,
  //             max_tokens: 800,
  //             messages: [{ role: "user", content: request.prompt }],
  //           }),
  //         };
  //         respondWith.string((signal) =>
  //           window
  //             .fetch("https://api.openai.com/v1/chat/completions", {
  //               signal,
  //               ...openAiOptions,
  //             })
  //             .then(async (response) => {
  //               if (response) {
  //                 const data = await response.json();
  //                 if (data.error) {
  //                   throw new Error(
  //                     `${data.error.type}: ${data.error.message}`
  //                   );
  //                 } else if (response.ok) {
  //                   return data?.choices[0]?.message?.content?.trim();
  //                 }
  //               } else {
  //                 throw new Error("Failed to communicate with the AI");
  //               }
  //             })
  //         );
  //       },
  //       setup: (editor) => {
  //         // Add a custom button or any setup logic here
  //         editor.ui.registry.addButton("customButton", {
  //           text: "My Custom Button",
  //           onAction: function () {
  //             editor.insertContent(
  //               "&nbsp;<strong>Custom content!</strong>&nbsp;"
  //             );
  //           },
  //         });

  //         // Capture the editor content on change and set it to the state
  //         editor.on("change", () => {
  //           const content = editor.getContent();
  //           setEditorContent(content, tinyNo); // Update the state with editor content
  //           // console.log("Editor Content changed:", content);  // Log the editor content
  //         });
  //       },
  //     });
  //   }

  //   // Cleanup TinyMCE when the component unmounts
  //   return () => {
  //     if (window.tinymce && editorRef.current) {
  //       window.tinymce.remove(editorRef.current);
  //     }
  //   };
  // }, [editorRef, temp]);

  const tempFunc = () => {
    let api_key = " import.meta.env.VITE_OPEN_AI_API_KEY";

    // Initialize TinyMCE when the component mounts
    if (window.tinymce) {
      window.tinymce.init({
        target: editorRef.current,
        height: 500,
        menubar: true,
        toolbar:
          "undo redo | aidialog aishortcuts | charmap | blocks fontsizeinput | bold italic | align numlist bullist | link | table pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
        plugins:
          "ai preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown",

        ai_request: (request, respondWith) => {
          // Handle AI request
          const openAiOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${api_key}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              temperature: 0.7,
              max_tokens: 800,
              messages: [{ role: "user", content: request.prompt }],
            }),
          };
          respondWith.string((signal) =>
            window
              .fetch("https://api.openai.com/v1/chat/completions", {
                signal,
                ...openAiOptions,
              })
              .then(async (response) => {
                if (response) {
                  const data = await response.json();
                  if (data.error) {
                    throw new Error(
                      `${data.error.type}: ${data.error.message}`
                    );
                  } else if (response.ok) {
                    return data?.choices[0]?.message?.content?.trim();
                  }
                } else {
                  throw new Error("Failed to communicate with the AI");
                }
              })
          );
        },
        setup: (editor) => {
          // Add a custom button or any setup logic here
          editor.ui.registry.addButton("customButton", {
            text: "My Custom Button",
            onAction: function () {
              editor.insertContent(
                "&nbsp;<strong>Custom content!</strong>&nbsp;"
              );
            },
          });

          // Capture the editor content on change and set it to the state
          editor.on("change", () => {
            const content = editor.getContent();
            setEditorContent(content, tinyNo); // Update the state with editor content
            // console.log("Editor Content changed:", content);  // Log the editor content
          });
        },
      });
    }

    // Cleanup TinyMCE when the component unmounts
    return () => {
      if (window.tinymce && editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
    };
  };
  setTimeout(() => {
    if (temp) {
      tempFunc();
      setTemp(false);
    }
  }, 500);
  return (
    <div style={{ padding: "15px 0px" }} className="shadow-lg">
      {/* Textarea ref where TinyMCE will be initialized */}
      <textarea ref={editorRef} defaultValue={editorContent} key={tinyNo} />
    </div>
  );
}
