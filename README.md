# web3Storage-uploadFiles  
使用web3Storage上传文件到IPFS  
需要new Web3Storage({ token: yourToken })  
// If you're just testing, you can paste in a token  
// and uncomment the following line:  
// return 'paste-your-token-here'  
  
// In a real app, it's better to read an access token from an   
// environement variable or other configuration that's kept outside of   
// your code base. For this to work, you need to set the  
// WEB3STORAGE_TOKEN environment variable before you run your code.  
`makeStorageClient() {  
`    return new Web3Storage({ token: yourToken })  
`}  
  
//上传文件  
`const client = this.web3S1.makeStorageClient()  
  
/**
* 调用Web3Storage中的put()
* Uploads files to web3.storage. Files are hashed in the client and uploaded as a single
* [Content Addressed Archive(CAR)](https://github.com/ipld/specs/blob/master/block-layer/content-addressable-archives.md).
* Takes a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob)
*
* Returns the corresponding Content Identifier (CID).
*
* @example
* js
* `const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
* `const cid = await client.put([file])
* 
* @param {Iterable<Filelike>} files
* @param {PutOptions} [options]
* ` put (files, options) {
* `   return Web3Storage.put(this, files, options)
* ` }
*/
`var cid = await client.put(files)  
  
//下载文件   
//命令行执行  
`curl https://YOUR CID.ipfs.dweb.link/FILE NAME -o ~/OUTPUT FILE  
