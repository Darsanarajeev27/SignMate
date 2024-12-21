console.log("Content script loaded");
const threeJS = document.createElement('script');
threeJS.src = chrome.runtime.getURL('libs/three.min.js');
document.head.appendChild(threeJS);

const fbxLoader = document.createElement('script');
fbxLoader.src = chrome.runtime.getURL('libs/FBXLoader.js');
document.head.appendChild(fbxLoader);

threeJS.onload = () => {
    fbxLoader.onload = () => {
        console.log("Local libraries loaded successfully!");
    };
};

// Inject a WebGL canvas into the webpage
const injectCanvas = () => {
    const canvasContainer = document.createElement("div");
    canvasContainer.id = "sign-language-avatar";
    canvasContainer.style.position = "fixed";
    canvasContainer.style.bottom = "20px";
    canvasContainer.style.right = "20px";
    canvasContainer.style.width = "300px";
    canvasContainer.style.height = "400px";
    canvasContainer.style.zIndex = "10000";
    canvasContainer.style.backgroundColor = "transparent";
    document.body.appendChild(canvasContainer);

    const canvas = document.createElement("canvas");
    canvas.id = "avatar-canvas";
    canvasContainer.appendChild(canvas);

    return canvas;
};

// Initialize Three.js
const initializeThreeJS = (canvas) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000, 0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 2, 3);
    scene.add(light);

    return { scene, camera, renderer };
};

// Load and play FBX animations
const loadFBXAnimation = (filePath, scene, mixer) => {
    const loader = new THREE.FBXLoader();

    loader.load(
        chrome.runtime.getURL(filePath), // Load file from the extension directory
        (object) => {
            mixer.stopAllAction(); // Stop any existing animations
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(object);

            // Play the animation
            if (object.animations.length > 0) {
                const action = mixer.clipAction(object.animations[0]);
                action.reset().play();
            }
        },
        undefined,
        (error) => console.error("Error loading FBX file:", error)
    );
};

// Read text from the transcription file
const readTranscriptionFile = async () => {
    const response = await fetch('transcription_translated_to_english.txt');
    const text = await response.text();
    return text;
};

// Main function to trigger the interpreter
function    enableInterpreter() {
    console.log("hijja")
    const canvas = injectCanvas();
    const { scene, camera, renderer } = initializeThreeJS(canvas);
    const mixer = new THREE.AnimationMixer(scene);

    const phraseMapping = {
        "hi": "fbx/hai.fbx",
        "my": "fbx/my.fbx",
        "name is": "fbx/nameis.fbx",
        "a": "fbx/a.fbx",
        "n": "fbx/n.fbx"
    };

    readTranscriptionFile().then(transcriptionText => {
        const phrases = transcriptionText.split(/[\n\s,\.]+/); // Split by space, comma, period, or newline
        let index = 0;

        const playNextPhrase = () => {
            if (index < phrases.length) {
                const phrase = phrases[index].toLowerCase();
                const fbxFile = phraseMapping[phrase];

                if (fbxFile) {
                    loadFBXAnimation(fbxFile, scene, mixer);
                }

                index++;
                setTimeout(playNextPhrase, 3000); // Wait 3 seconds for each phrase
            }
        };

        playNextPhrase();

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            renderer.render(scene, camera);
        };

        animate();
    });
}

// Disable the interpreter (clear canvas or stop animations)
function disableInterpreter() {
    const avatarCanvas = document.getElementById('avatar-canvas');
    if (avatarCanvas) {
        avatarCanvas.remove(); // Remove the avatar canvas from the page
    }
}

