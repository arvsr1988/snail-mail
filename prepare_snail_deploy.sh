#bin/bash
DEPLOY_DIR=../snail-deploy
SOURCE_DIR=.

echo $DEPLOY_DIR
echo $SOURCE_DIR

rm -rf $SOURCE_DIR/dist/
rm -rf $DEPLOY_DIR/*
mkdir -p $DEPLOY_DIR
cd $SOURCE_DIR && npm run create-artifact
cp $SOURCE_DIR/package.json $DEPLOY_DIR/
cp -rf $SOURCE_DIR/dist/* $DEPLOY_DIR/
cd $DEPLOY_DIR
chmod -R 755 public/
