// import React, { useEffect, useRef, useState } from "react";

// export default function TinyEditor({
//   editorContent,
//   setEditorContent,
//   tinyNo,
// }) {
//   const editorRef = useRef(null);
//   const [temp, setTemp] = useState(true);

//   // useEffect(() => {
//   //   let api_key = " import.meta.env.VITE_OPEN_AI_API_KEY";

//   //   // Initialize TinyMCE when the component mounts
//   //   if (window.tinymce) {
//   //     window.tinymce.init({
//   //       target: editorRef.current,
//   //       height: 500,
//   //       menubar: true,
//   //       toolbar:
//   //         "undo redo | aidialog aishortcuts | charmap | blocks fontsizeinput | bold italic | align numlist bullist | link | table pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
//   //       plugins:
//   //         "ai preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown",

//   //       ai_request: (request, respondWith) => {
//   //         // Handle AI request
//   //         const openAiOptions = {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //             Authorization: `Bearer ${api_key}`,
//   //           },
//   //           body: JSON.stringify({
//   //             model: "gpt-3.5-turbo",
//   //             temperature: 0.7,
//   //             max_tokens: 800,
//   //             messages: [{ role: "user", content: request.prompt }],
//   //           }),
//   //         };
//   //         respondWith.string((signal) =>
//   //           window
//   //             .fetch("https://api.openai.com/v1/chat/completions", {
//   //               signal,
//   //               ...openAiOptions,
//   //             })
//   //             .then(async (response) => {
//   //               if (response) {
//   //                 const data = await response.json();
//   //                 if (data.error) {
//   //                   throw new Error(
//   //                     `${data.error.type}: ${data.error.message}`
//   //                   );
//   //                 } else if (response.ok) {
//   //                   return data?.choices[0]?.message?.content?.trim();
//   //                 }
//   //               } else {
//   //                 throw new Error("Failed to communicate with the AI");
//   //               }
//   //             })
//   //         );
//   //       },
//   //       setup: (editor) => {
//   //         // Add a custom button or any setup logic here
//   //         editor.ui.registry.addButton("customButton", {
//   //           text: "My Custom Button",
//   //           onAction: function () {
//   //             editor.insertContent(
//   //               "&nbsp;<strong>Custom content!</strong>&nbsp;"
//   //             );
//   //           },
//   //         });

//   //         // Capture the editor content on change and set it to the state
//   //         editor.on("change", () => {
//   //           const content = editor.getContent();
//   //           setEditorContent(content, tinyNo); // Update the state with editor content
//   //           // console.log("Editor Content changed:", content);  // Log the editor content
//   //         });
//   //       },
//   //     });
//   //   }

//   //   // Cleanup TinyMCE when the component unmounts
//   //   return () => {
//   //     if (window.tinymce && editorRef.current) {
//   //       window.tinymce.remove(editorRef.current);
//   //     }
//   //   };
//   // }, [editorRef, temp]);

//   const tempFunc = () => {
//     let api_key = " import.meta.env.VITE_OPEN_AI_API_KEY";

//     // Initialize TinyMCE when the component mounts
//     if (window.tinymce) {
//       window.tinymce.init({
//         target: editorRef.current,
//         height: 500,
//         menubar: true,
//         toolbar:
//           "undo redo | aidialog aishortcuts | charmap | blocks fontsizeinput | bold italic | align numlist bullist | link | table pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
//         plugins:
//           "ai preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown",

//         ai_request: (request, respondWith) => {
//           // Handle AI request
//           const openAiOptions = {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${api_key}`,
//             },
//             body: JSON.stringify({
//               model: "gpt-3.5-turbo",
//               temperature: 0.7,
//               max_tokens: 800,
//               messages: [{ role: "user", content: request.prompt }],
//             }),
//           };
//           respondWith.string((signal) =>
//             window
//               .fetch("https://api.openai.com/v1/chat/completions", {
//                 signal,
//                 ...openAiOptions,
//               })
//               .then(async (response) => {
//                 if (response) {
//                   const data = await response.json();
//                   if (data.error) {
//                     throw new Error(
//                       `${data.error.type}: ${data.error.message}`
//                     );
//                   } else if (response.ok) {
//                     return data?.choices[0]?.message?.content?.trim();
//                   }
//                 } else {
//                   throw new Error("Failed to communicate with the AI");
//                 }
//               })
//           );
//         },
//         setup: (editor) => {
//           // Add a custom button or any setup logic here
//           editor.ui.registry.addButton("customButton", {
//             text: "My Custom Button",
//             onAction: function () {
//               editor.insertContent(
//                 "&nbsp;<strong>Custom content!</strong>&nbsp;"
//               );
//             },
//           });

//           // Capture the editor content on change and set it to the state
//           editor.on("change", () => {
//             const content = editor.getContent();
//             setEditorContent(content, tinyNo); // Update the state with editor content
//             // console.log("Editor Content changed:", content);  // Log the editor content
//           });
//         },
//       });
//     }

//     // Cleanup TinyMCE when the component unmounts
//     return () => {
//       if (window.tinymce && editorRef.current) {
//         window.tinymce.remove(editorRef.current);
//       }
//     };
//   };
//   setTimeout(() => {
//     if (temp) {
//       tempFunc();
//       setTemp(false);
//     }
//   }, 250);
//   console.log(editorContent.replace(/^"|"$/g, "").trim() || "NA","editor")
//   return (
//     <div style={{ padding: "15px 0px" }} className="shadow-lg">
//       {/* Textarea ref where TinyMCE will be initialized */}
//       <textarea ref={editorRef} defaultValue={editorContent?.replace(/^"|"$/g, "")?.trim()} key={tinyNo} />
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";

// export default function TinyEditor({
//   editorContent,
//   setEditorContent,
//   tinyNo,
//   isDisabled = false,
//   defaultContent,
// }) {
//   const editorRef = useRef(null);
//   const [temp, setTemp] = useState(true);

//   const tempFunc = () => {
//     let api_key = "";

//     // Initialize TinyMCE when the component mounts
//     if (window.tinymce) {
//       window.tinymce.init({
//         target: editorRef.current,
//         height: 300,
//         menubar: true,
//         disabled: isDisabled,
//         plugins:
//           "math importword exportword checklist ai advtable preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown",
//         toolbar:
//           "undo redo | checklist math importword exportword | aidialog aishortcuts | charmap | blocks fontsizeinput | bold italic | align numlist bullist | link | table pageembed | lineheight outdent indent | strikethrough forecolor backcolor formatpainter removeformat | emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
//         ai_request: (request, respondWith) => {
//           // Handle AI request
//           const openAiOptions = {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${api_key}`,
//             },
//             body: JSON.stringify({
//               model: "gpt-3.5-turbo",
//               temperature: 0.7,
//               max_tokens: 800,
//               messages: [{ role: "user", content: request.prompt }],
//             }),
//           };
//           respondWith.string((signal) =>
//             window
//               .fetch("https://api.openai.com/v1/chat/completions", {
//                 signal,
//                 ...openAiOptions,
//               })
//               .then(async (response) => {
//                 if (response) {
//                   const data = await response.json();
//                   if (data.error) {
//                     throw new Error(
//                       `${data.error.type}: ${data.error.message}`
//                     );
//                   } else if (response.ok) {
//                     return data?.choices[0]?.message?.content?.trim();
//                   }
//                 } else {
//                   throw new Error("Failed to communicate with the AI");
//                 }
//               })
//           );
//         },

//         setup: (editor) => {
//           // Add a custom button or any setup logic here
//           editor.ui.registry.addButton("customButton", {
//             text: "My Custom Button",
//             onAction: function () {
//               editor.insertContent(
//                 "&nbsp;<strong>Custom content!</strong>&nbsp;"
//               );
//             },
//           });

//           // Capture the editor content on change and set it to the state
//           editor.on("change", () => {
//             const content = editor.getContent();
//             setEditorContent(content, tinyNo); // Update the state with editor content
//             // console.log("Editor Content changed:", content);  // Log the editor content
//           });
//         },
//       });
//     }

//     // Cleanup TinyMCE when the component unmounts
//     return () => {
//       if (window.tinymce && editorRef.current) {
//         window.tinymce.remove(editorRef.current);
//       }
//     };
//   };
//   setTimeout(() => {
//     if (temp) {
//       tempFunc();
//       setTemp(false);
//     }
//   }, 1000);
//   return (
//     <div className="shadow rounded-xl mb-4">
//       {/* Textarea ref where TinyMCE will be initialized */}
//       <textarea
//         ref={editorRef}
//         defaultValue={editorContent || defaultContent}
//         key={tinyNo}
//       />
//     </div>
//   );
// }

//Froala Editor Code Below
import React, { useEffect, useState, useRef } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
// import { ANUH_BASE_URL } from "../api/config";

const TinyEditor = ({
  editorContent,
  setEditorContent,
  isDisabled = false,
  placeholder = "Enter Your Content Here!",
  height = "300px",
  tinyNo,
  toolbarButtons = {
    moreText: {
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "subscript",
        "superscript",
        "fontFamily",
        "fontSize",
        "textColor",
        "backgroundColor",
        "inlineClass",
        "inlineStyle",
        "clearFormatting",
      ],
    },
    moreParagraph: {
      buttons: [
        "alignLeft",
        "alignCenter",
        "formatOLSimple",
        "alignRight",
        "alignJustify",
        "formatOL",
        "formatUL",
        "paragraphFormat",
        "paragraphStyle",
        "lineHeight",
        "outdent",
        "indent",
        "quote",
      ],
    },
    moreRich: {
      buttons: [
        "insertLink",
        "insertImage",
        // "insertVideo",
        "insertTable",
        "emoticons",
        "fontAwesome",
        "specialCharacters",
        "embedly",
        "insertFile",
        "insertHR",
      ],
    },
    moreMisc: {
      buttons: [
        "undo",
        "redo",
        "fullscreen",
        "print",
        "getPDF",
        "spellChecker",
        "selectAll",
        "html",
        "help",
      ],
      align: "right",
      buttonsVisible: 3,
    },
  },
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    setTimeout(() => setIsEditorReady(true), 3000);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      if (isDisabled) {
        editorRef.current.edit.off();
        // Allow fullscreen even when disabled
        const fullscreenBtn = this.$tb.find(
          '.fr-command[data-cmd="fullscreen"]'
        );
        fullscreenBtn.removeClass("fr-disabled");
        fullscreenBtn.on("mousedown", (e) => {
          e.preventDefault();
          this.fullscreen.toggle();
        });
      } else {
        editorRef.current.edit.on();
      }
    }
  }, [isDisabled]);

  const config = {
    key: "wFE7nD5F4B3J4A11A8C7fLUQZf1ASFb1EFRNh1Hb1BCCQDUHnA8B6E5C5B1D3C3A1C8A6==",
    placeholderText: placeholder,
    charCounterCount: true,
    theme: "gray",
    height: height,
    fontSizeDefaultSelection: "14",
    toolbarButtons: toolbarButtons,

    // Upload configurations
    imageUploadParam: "files[]",
    imageUploadMethod: "POST",
    // imageUploadURL: `${ANUH_BASE_URL}/api/upload-multiple-attachments`,

    fileUploadParam: "files[]",
    fileUploadMethod: "POST",
    // fileUploadURL: `${ANUH_BASE_URL}/api/upload-multiple-attachments`,

    videoUploadParam: "files[]",
    videoUploadMethod: "POST",
    // videoUploadURL: `${ANUH_BASE_URL}/api/upload-multiple-attachments`,

    imageMaxSize: 20 * 1024 * 1024,
    videoMaxSize: 500 * 1024 * 1024,
    fileMaxSize: 50 * 1024 * 1024,

    // Video specific configurations
    videoAllowedTypes: ["mp4", "webm", "ogg"],
    videoDefaultWidth: 600,
    videoDefaultAlign: "center",
    videoResize: true,
    videoResponsive: true,
    listAdvancedTypes: true,

    // Request headers
    requestHeaders: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },

    events: {
      initialized: function () {
        editorRef.current = this;
        if (isDisabled) {
          this.edit.off();
          const fullscreenBtn = this.$tb.find(
            '.fr-command[data-cmd="fullscreen"]'
          );
          fullscreenBtn.removeClass("fr-disabled");
          fullscreenBtn.on("mousedown", (e) => {
            e.preventDefault();
            this.fullscreen.toggle();
          });
        } else this.edit.on();
      },

      // Upload Before Handlers for BASE64 Conversion
      "image.beforeUpload": function (files) {
        const editor = this;

        if (files.length) {
          const reader = new FileReader();

          reader.onload = function (e) {
            const base64 = e.target.result;

            // Insert Base64 image directly
            editor.image.insert(base64, null, null, editor.image.get());
          };

          reader.readAsDataURL(files[0]);
        }

        // Hide the popup
        editor.popups.hideAll();

        // ❗ Prevent Froala from uploading the image to the server
        return false;
      },
      // Image Upload Success Handler
      //     "image.uploaded": function (response) {
      //         try {
      //           const data =
      //             typeof response === "string" ? JSON.parse(response) : response;

      //           if (Array.isArray(data) && data[0]?.url) {
      //             this.image.insert(data[0].url, false, null, this.image.get(), null);
      //           } else if (data?.url) {
      //             this.image.insert(data.url, false, null, this.image.get(), null);
      //           } else if (data?.data?.[0]?.url) {
      //             this.image.insert(
      //               data.data[0].url,
      //               false,
      //               null,
      //               this.image.get(),
      //               null
      //             );
      //           } else {
      //             console.error("Invalid image upload response format:", data);
      //           }
      //         } catch (error) {
      //           console.error("Error parsing image upload response:", error);
      //       }
      //   return false; // prevent default behavior
      // },

      //  Video Upload Success Handler - CORRECTED
      "video.uploaded": function (response) {
        try {
          const data =
            typeof response === "string" ? JSON.parse(response) : response;
          let videoUrl;

          // Handle different response formats
          if (Array.isArray(data) && data[0]?.url) {
            videoUrl = data[0].url;
          } else if (data?.url) {
            videoUrl = data.url;
          } else if (data?.data?.[0]?.url) {
            videoUrl = data.data[0].url;
          } else {
            console.error("Invalid video upload response format:", data);
            return false;
          }

          if (videoUrl) {
            // Create video element with proper attributes
            const videoHtml = `
              <video 
                controls 
                style="max-width: 100%; height: auto; display: block; margin: 0 auto;" 
                class="fr-draggable"
              >
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            `;

            // Insert the video HTML
            this.html.insert(videoHtml);

            // Alternative method using Froala's video.insert
            // this.video.insert(videoUrl, null, null, this.video.get(), {
            //   attributes: {
            //     controls: true,
            //     style: "max-width: 100%; height: auto;"
            //   }
            // });
          }
        } catch (error) {
          console.error("Error parsing video upload response:", error);
        }
        return false;
      },

      //  File Upload Success Handler
      "file.uploaded": function (response) {
        try {
          const data =
            typeof response === "string" ? JSON.parse(response) : response;
          let fileUrl, fileName;

          if (Array.isArray(data) && data[0]) {
            fileUrl = data[0].url;
            fileName = data[0].name || data[0].original_name || "download";
          } else if (data?.url) {
            fileUrl = data.url;
            fileName = data.name || data.original_name || "download";
          } else if (data?.data?.[0]) {
            fileUrl = data.data[0].url;
            fileName =
              data.data[0].name || data.data[0].original_name || "download";
          } else {
            console.error("Invalid file upload response format:", data);
            return false;
          }

          if (fileUrl) {
            this.file.insert(
              fileUrl,
              {
                text: fileName,
                target: "_blank",
              },
              {
                title: fileName,
                download: fileName,
              }
            );
          }
        } catch (error) {
          console.error("Error parsing file upload response:", error);
        }
        return false;
      },

      //  Upload Error Handlers
      "file.uploadError": function (error) {
        console.error("File upload error:", error);
      },

      "image.uploadError": function (error) {
        console.error("Image upload error:", error);
      },

      "video.uploadError": function (error) {
        console.error("Video upload error:", error);
      },

      //  Video specific events
      "video.loaded": function (video) {
        console.log("Video loaded:", video);
      },

      "video.error": function (error) {
        console.error("Video error:", error);
      },

      contentChanged: function () {
        if (isMountedRef.current && setEditorContent) {
          try {
            setEditorContent(this.html.get(), tinyNo);
          } catch (error) {
            console.warn("Error in contentChanged:", error);
          }
        }
      },
    },
  };

  return (
    <div ref={containerRef} style={{ minHeight: "160px" }}>
      {!isEditorReady ? (
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "160px" }}
        >
          <div className="bg-white w-full  rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-100 ">
              <div className="flex items-center space-x-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-300 h-8 w-8 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="p-4 py-10 min-h-[250px]">
              <div className="space-y-6">
                <div className="bg-gray-300 h-4 w-3/4 rounded animate-pulse"></div>
                <div className="bg-gray-300 h-4 w-[90%] rounded animate-pulse"></div>
                <div className="bg-gray-300 h-4 w-2/3 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FroalaEditor
          tag="textarea"
          model={editorContent}
          onModelChange={setEditorContent}
          config={config}
        />
      )}
    </div>
  );
};

// React Summernote Lite Editor Code Below
// import React, { useEffect, useRef, useState } from "react";
// import SummernoteLite from "react-summernote-lite";
// import 'react-summernote-lite/dist/summernote-lite.min.css';

// const TinyEditor = ({
//   editorContent,
//   setEditorContent,
//   tinyNo,
//   isDisabled = false,
//   placeholder = "Enter Your Content Here!",
//   height = 300,
// }) => {
//   const noteRef = useRef(null);
//   const [isEditorReady, setIsEditorReady] = useState(false);

//   // Function to handle content changes
//   const handleContentChange = (content) => {
//     console.log(content, "content");
//     if (setEditorContent) {
//       setEditorContent(content, tinyNo);
//     }
//   };

//   // useEffect(() => {
//   //   if (noteRef.current && isEditorReady) {
//   //     const currentEditorCode = noteRef.current.summernote('code');
//   //           if (currentEditorCode !== (editorContent || '')) {
//   //       noteRef.current.summernote('code', editorContent || '');
//   //     }
//   //   }
//   // }, [editorContent, isEditorReady]);

//   useEffect(() => {
//     if (noteRef.current && isEditorReady) {
//       if (isDisabled) {
//         noteRef.current.summernote('disable');
//       } else {
//         noteRef.current.summernote('enable');
//       }
//     }
//   }, [isDisabled, isEditorReady]);

//   // --- Configuration ---
//   const config = {
//     height: height,
//     placeholder: placeholder,
//     disableResizeEditor: true,

//     toolbar: [
//       ['font', ['bold', 'italic', 'underline', 'clear']],
//       ['para', ['ul', 'ol', 'paragraph']],
//       ['insert', ['link', 'picture']],
//       ['view', ['fullscreen', 'codeview']],
//       ['insert', ['link', 'picture', 'table', 'hr']]
//     ],

//     callbacks: {
//   onInit: () => {
//     setIsEditorReady(true);
//     if (editorContent) {
//       noteRef.current.summernote('code', editorContent);
//     }
//   },
//   onChange: handleContentChange,
// },
//   };

//   return (
//     <div style={{ minHeight: `${height}px` }}>
//       <SummernoteLite
//         ref={noteRef}
//         defaultValue={editorContent || ''}
//         {...config}
//       />
//     </div>
//   );
// };

export default TinyEditor;
