let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get("productId"));

if (!currentUser) window.location = "index.html";

function save() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function loadComments() {
    const box = document.getElementById("commentList");
    box.innerHTML = "";

    const productComments = reviews.filter(r => r.productId === productId);

    if (productComments.length === 0) {
        box.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    productComments.forEach(comment => {
        box.innerHTML += renderComment(comment);
    });
}

function renderComment(c) {
    let html = `
        <div style="; padding:10px; margin:10px 0;">
            <b>${c.username}</b>: ${c.text} <br>

            <button onclick="toggleLike(${c.id})">
                 Like (${c.likes.length})
            </button>

            <button onclick="toggleReplies(${c.id})">Show Replies (${c.replies.length})</button>

            ${c.userId === currentUser.id ? `
                <button onclick="deleteComment(${c.id})">Delete</button>
            ` : ""}

            <div id="replySection-${c.id}" style="display:none; margin-left:20px;">

                ${c.replies.map(r => renderReply(c.id, r)).join("")}

                <input id="replyInput-${c.id}" placeholder="Reply...">
                <button onclick="addReply(${c.id})">Send</button>
            </div>
        </div>
    `;
    return html;
}

function renderReply(commentId, r) {
    return `
        <div style=" padding:5px; margin:5px 0;">
            <b>${r.username}</b>:<br> ${r.text} <br>

            <button onclick="toggleReplyLike(${commentId}, ${r.id})">like
                 (${r.likes.length})
            </button>

            ${r.userId === currentUser.id ? `
                <button onclick="deleteReply(${commentId}, ${r.id})">Delete</button>
            ` : ""}
        </div>
    `;
}

function addComment() {
    let text = document.getElementById("commentInput").value.trim();
    if (!text) return;

    const newComment = {
        id: Date.now(),
        productId: productId,
        userId: currentUser.id,
        username: currentUser.username,
        text: text,
        likes: [],
        replies: []
    };

    reviews.push(newComment);
    save();
    document.getElementById("commentInput").value = "";
    loadComments();
}

function addReply(commentId) {
    let input = document.getElementById(`replyInput-${commentId}`);
    let text = input.value.trim();
    if (!text) return;

    let comment = reviews.find(r => r.id === commentId);
    if (!comment) return;

    comment.replies.push({
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        text: text,
        likes: []
    });

    save();
    input.value = "";
    loadComments();
}

function toggleLike(commentId) {
    let c = reviews.find(r => r.id === commentId);
    if (!c) return;

    let idx = c.likes.indexOf(currentUser.id);

    if (idx === -1) c.likes.push(currentUser.id);
    else c.likes.splice(idx, 1);

    save();
    loadComments();
}

function toggleReplyLike(commentId, replyId) {
    let c = reviews.find(r => r.id === commentId);
    if (!c) return;

    let reply = c.replies.find(r => r.id === replyId);
    if (!reply) return;

    let idx = reply.likes.indexOf(currentUser.id);

    if (idx === -1) reply.likes.push(currentUser.id);
    else reply.likes.splice(idx, 1);

    save();
    loadComments();
}

function deleteComment(commentId) {
    reviews = reviews.filter(r => r.id !== commentId);
    save();
    loadComments();
}

function deleteReply(commentId, replyId) {
    let c = reviews.find(r => r.id === commentId);
    if (!c) return;

    c.replies = c.replies.filter(r => r.id !== replyId);
    save();
    loadComments();
}

function toggleReplies(commentId) {
    let section = document.getElementById(`replySection-${commentId}`);
    section.style.display = section.style.display === "none" ? "block" : "none";
}

loadComments();
