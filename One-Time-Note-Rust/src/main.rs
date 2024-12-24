use actix_files::Files;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use std::collections::HashMap;
use std::sync::Mutex;
use uuid::Uuid;
use base62::encode;

#[derive(Deserialize)]
struct Note {
    note: String,
}

struct AppState {
    notes: Mutex<HashMap<String, String>>,
}

async fn index() -> impl Responder {
    HttpResponse::Ok().content_type("text/html").body(include_str!("../public/index.html"))
}

async fn create_note(
    data: web::Data<AppState>,
    note: web::Json<Note>,
) -> impl Responder {
    let id = Uuid::new_v4().to_string();
    let hex_string = id.replace("-", "");
    let num = u128::from_str_radix(&hex_string, 16).unwrap();
    let short_id = encode(num);
    data.notes.lock().unwrap().insert(short_id.clone(), note.note.clone());
    HttpResponse::Ok().json(serde_json::json!({ "link": format!("http://127.0.0.1:3000/note/{}", short_id) }))
}

async fn get_note(
    data: web::Data<AppState>,
    path: web::Path<String>,
) -> impl Responder {
    let id = path.into_inner();
    let mut notes = data.notes.lock().unwrap();
    if let Some(note) = notes.remove(&id) {
        HttpResponse::Ok().content_type("text/html").body(format!(
            r#"
            <html>
            <head>
                <title>One-Time Note</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        margin: 0;
                    }}
                    .container {{
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }}
                    button {{
                        display: block;
                        width: 100%;
                        padding: 10px;
                        background-color: #007BFF;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 20px;
                    }}
                    button:hover {{
                        background-color: #0056b3;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>One-Time Note</h1>
                    <p><strong>Warning:</strong> This is a one-time note. Once you click the button below, the note will be displayed and then deleted.</p>
                    <button onclick="showNote()">Show Note</button>
                    <div id="noteContent" style="display:none;">
                        <p>{}</p>
                    </div>
                </div>
                <script>
                    function showNote() {{
                        document.getElementById('noteContent').style.display = 'block';
                        document.querySelector('button').style.display = 'none';
                    }}
                </script>
            </body>
            </html>
            "#,
            note
        ))
    } else {
        HttpResponse::Ok().content_type("text/html").body(format!(
            r#"
            <html>
            <head>
                <title>Note Not Found</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        margin: 0;
                    }}
                    .container {{
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Note Not Found</h1>
                    <p>The note was not found or has already been viewed.</p>
                </div>
            </body>
            </html>
            "#,
        ))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let data = web::Data::new(AppState {
        notes: Mutex::new(HashMap::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .service(Files::new("/public", "./public").index_file("index.html"))
            .route("/", web::get().to(index))
            .route("/create-note", web::post().to(create_note))
            .route("/note/{id}", web::get().to(get_note))
    })
    .bind("127.0.0.1:3000")?
    .run()
    .await
}
