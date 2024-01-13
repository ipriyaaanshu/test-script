const action_name = "action_hello_world";
const chat_server_url = "server_url";
const sender_id = uuidv4();
const pathname = window.location.pathname;
const hostname = window.location.hostname;
let session_id = null;

async function getSessionId(sender_id, pathname) {
    // Constructing the URL with query parameters
    const session_server = new URL(chat_server_url + "/session/");
    session_server.searchParams.append('sender', sender_id);
    session_server.searchParams.append('hostname', pathname);
  
    try {
        const response = await fetch(session_server, {
            method: 'GET'
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const responseData = await response.json();
        session_id = responseData.session_id;
        return responseData.session_id; // Assuming the response has a 'session_id' field
    } catch (error) {
        console.error('Error fetching session ID:', error);
        return null; // or handle the error as needed
    }
  }


getSessionId(sender_id, pathname);