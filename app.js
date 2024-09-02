let nextDom = document.getElementById("next");
let prevDom = document.getElementById("prev");

let carouselDom = document.querySelector(".carousel");
let SliderDom = carouselDom.querySelector(".carousel .list");
let thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll(".item");
let timeDom = document.querySelector(".carousel .time");
let buttons = document.querySelectorAll(
  ".carousel .list .item .buttons button:nth-child(1), .carousel .list .item .buttons button:nth-child(2)"
);
let timeRunning = 500;
let timeAutoNext = 7000;
// Function to stop the carousel
function stopCarousel() {
  clearTimeout(runNextAuto); // Stops the auto-next
  clearTimeout(runTimeOut); // Stops the animation timeout
}

// Function to restart the carousel
function restartCarousel() {
  runNextAuto = setTimeout(() => {
    nextDom.click(); // Triggers the next slide
  }, timeAutoNext);
}

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

nextDom.onclick = function () {
  showSlider("next");
};

prevDom.onclick = function () {
  showSlider("prev");
};
let runTimeOut;
let runNextAuto = setTimeout(() => {
  next.click();
}, timeAutoNext);
function showSlider(type, index = 0) {
  let SliderItemsDom = SliderDom.querySelectorAll(".carousel .list .item");
  let thumbnailItemsDom = document.querySelectorAll(
    ".carousel .thumbnail .item"
  );
  let shareButtonsDom = document.querySelectorAll(".share-buttons");

  shareButtonsDom.forEach((buttonsContainer) => {
    if (buttonsContainer.style.display === "flex") {
      buttonsContainer.style.display = "none";
    }
  });

  if (type === "next") {
    SliderDom.appendChild(SliderItemsDom[0]);
    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    carouselDom.classList.add("next");
  } else {
    SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
    thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
    carouselDom.classList.add("prev");
  }
  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    carouselDom.classList.remove("next");
    carouselDom.classList.remove("prev");
  }, timeRunning);

  clearTimeout(runNextAuto);
  runNextAuto = setTimeout(() => {
    next.click();
  }, timeAutoNext);
}

buttons.forEach((button) => {
  button.addEventListener("mouseenter", stopCarousel);
  button.addEventListener("mouseleave", restartCarousel);
});

// for the download functionality

document.addEventListener("DOMContentLoaded", function () {
  const downloadButtons = document.querySelectorAll(".downloadButton");

  downloadButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      try {
        const item = this.closest(".item");

        const title = item.querySelector(".title").textContent.trim();
        const topic = item.querySelector(".topic").textContent.trim();
        const description = item.querySelector(".des").textContent.trim();
        const imgElement = item.querySelector("img");

        const imgSrc = imgElement.src;
        const imgData = await loadImageAsBase64(imgSrc);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`${title}`, 80, 20);

        doc.setFontSize(14);
        doc.text(`Topic: ${topic}`, 20, 30);

        doc.addImage(imgData, "JPEG", 20, 40, 160, 90);

        doc.setFontSize(14);
        doc.text(`Description:`, 20, 140);

        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(description, 170), 20, 150);

        doc.save(`${title}.pdf`);
      } catch (error) {
        console.error("An error occurred while generating the PDF:", error);
      }
    });
  });
});

// Helper function to convert image to Base64
function loadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = function () {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

// for the share functionality

document.addEventListener("DOMContentLoaded", function () {
  const shareButtons = document.querySelectorAll(".shareButton");

  shareButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const item = this.closest(".item");
      const title = item.querySelector(".title").textContent.trim();
      const description = item.querySelector(".des").textContent.trim();
      const imageUrl = item.querySelector("img").alt;
      const url = window.location.href;

      const facebookLink = item.querySelector(".share-facebook");
      facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(title + ": " + description)}`;

      const twitterLink = item.querySelector(".share-twitter");
      twitterLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title + ": " + description
      )}&url=${encodeURIComponent(url)}`;

      const linkedinLink = item.querySelector(".share-linkedin");
      linkedinLink.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        description
      )}&source=${encodeURIComponent(url)}`;

      const whatsappLink = item.querySelector(".share-whatsapp");
      whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(
        "\n" +
          title +
          " \n\n" +
          description +
          " \n\n " +
          imageUrl +
          "\n\nYou can view our highlights on our website\n\n" +
          url
      )}`;

      const shareButtonsContainer = item.querySelector(".share-buttons");
      shareButtonsContainer.style.display =
        shareButtonsContainer.style.display === "none" ||
        shareButtonsContainer.style.display === ""
          ? "flex"
          : "none";
    });
  });
});

// for the shorting the description in the mobile screen

document.addEventListener("DOMContentLoaded", function () {
  var desElements = document.querySelectorAll(".des");

  desElements.forEach(function (des) {
    var fullText = des.textContent;

    if (window.innerWidth <= 768) {
      if (fullText.length > 200) {
        des.textContent = fullText.substring(0, 200) + "...";
      }
    }
  });
});

// for the searching functionality

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const carouselItems = document.querySelectorAll(".carousel .list .item");

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();

    carouselItems.forEach(function (item) {
      const title = item.querySelector(".title").textContent.toLowerCase();
      const topic = item.querySelector(".topic").textContent.toLowerCase();

      if (title.includes(query) || topic.includes(query)) {
        item.style.display = "block";
      }
    });
  });
});
