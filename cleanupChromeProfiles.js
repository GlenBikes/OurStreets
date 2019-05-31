const fs = require('fs')
const glob = require('glob')

const cleanupChromeProfiles = () => {
    glob('/tmp/*', null, (err, files) => console.log('all files: ', files))
    glob('/tmp/core.headless_shell*', null, (err, files) => {
        if (err) console.log(err)
        files.forEach(f => {
            fs.unlink(f, (err) => {
                if (err) console.log('Error deleting file, ', f)
                console.log('file ', f, ' deleted')
            })
        })
    })
}

module.exports = cleanupChromeProfiles
