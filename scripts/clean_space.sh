#!/bin/bash
echo "--- Libération d'espace disque ---"

# Gradle Cache
echo "Suppression du cache Gradle..."
rm -rf ~/.gradle/caches
echo "Cache Gradle supprimé."

# Android NDK
# Les NDK sont souvent situés dans le SDK Android
# On cherche le dossier SDK
SDK_PATH=$ANDROID_HOME
if [ -z "$SDK_PATH" ]; then
    SDK_PATH=$HOME/Android/Sdk
fi

if [ -d "$SDK_PATH/ndk" ]; then
    echo "Suppression des anciennes versions du NDK dans $SDK_PATH/ndk..."
    # On garde potentiellement la version la plus récente si nécessaire, 
    # ici on supprime tout pour libérer le maximum d'espace.
    rm -rf "$SDK_PATH/ndk/*"
    echo "Versions NDK supprimées."
else
    echo "Dossier NDK non trouvé à $SDK_PATH/ndk."
fi

echo "--- Libération terminée ---"
