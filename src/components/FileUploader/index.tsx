import Dropzone from 'react-dropzone'
import useFileUploader from './useFileUploader'
import { Badge, Box, Button, Grid, Stack, Typography } from '@mui/material'
import Avatar from 'components/@extended/Avatar'
import { DocumentUpload } from 'iconsax-react'

export type FileType = File & {
  preview?: string
  formattedSize?: string
}

type FileUploaderProps = ChildrenProps & {
  onFileUpload?: (files: FileType[]) => void
  showPreview?: boolean
}

type ChildrenProps = {
  icon?: string
  text?: string
  textClass?: string
  extraText?: string
}

const FileUploader = ({ showPreview = true, onFileUpload, icon, extraText, text }: FileUploaderProps) => {
  const { selectedFiles, handleAcceptedFiles, removeFile } = useFileUploader(showPreview)
  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles, onFileUpload)}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
            <div className="dz-message needsclick" {...getRootProps()}>
              <input {...getInputProps()} />
              {icon && <DocumentUpload size={36} />}
              <h3>{text}</h3>
              <span className="text-muted fs-13">{extraText}</span>
            </div>
          </div>
        )}
      </Dropzone>

      {/* {showPreview && selectedFiles.length > 0 && ( */}
      <div className="dropzone-previews mt-3">
        {(selectedFiles || []).map((file, idx) => {
          const ext = file.name.substr(file.name.lastIndexOf('.') + 1)
          return (
            <Box sx={{
              border: "1px solid #eff2f7",
              borderRadius: "6px",
              padding: "4px"

            }}
              key={idx}
            >
              <Stack direction="row" spacing={2}>
                {file.preview && (<Grid item>
                  <Button onClick={() => removeFile(file)}><Badge badgeContent={"x"} color="error" overlap="circular">
                    <Avatar size='lg' src={file.preview} alt={file.name} />
                  </Badge></Button>
                </Grid>)}
                <Grid item>
                  <Typography variant='subtitle1'>{file.name}</Typography>
                  <Typography>{file.formattedSize}</Typography>
                </Grid>
              </Stack>
            </Box>
          )
        })}
      </div>
      {/* )} */}
    </>
  )
}

export { FileUploader }
