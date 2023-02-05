// Packages
import { useRouter } from "next/router";

// MUI
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Hooks
import { useCalculateDistance } from "@/hooks/useCalculateDistance";

// Styled Components
const ResultsWrapper = styled("section")(({ }) => ({
  ".background-image": {
    zIndex: -1,
    objectFit: "cover",
  },
}));
const ToolbarWrapper = styled(Toolbar)(({ theme }) => ({
  background: theme.palette.common.black,
  color: theme.palette.common.white,
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(6.3px)",
  border: "1px solid rgba(255, 255, 255, 0.86)",
  margin: 16,
}));
const StepperIcon = styled(FmdGoodOutlinedIcon)(({ }) => ({
  fontSize: 30,
}));
const StepperContainer = styled("div")(({ }) => ({
  margin: "30px 16px 16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));
const StepLabelEl = styled(StepLabel)(({ }) => ({
  position: "relative",

  ".distance": {
    position: "absolute",
    top: "-50%",
    right: "100%",
    transform: "translateX(-100%)",
    whiteSpace: "nowrap",
  },
}));
const containerCS = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
};

export default function Results(): JSX.Element {
  const { distances, isLoading, errors } = useCalculateDistance();
  const { push, query } = useRouter();

  return (
    <ResultsWrapper>
      <ToolbarWrapper>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2, cursor: "pointer" }}
            onClick={() => push("/")}
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Results
          </Typography>
        </Toolbar>
      </ToolbarWrapper>
      {errors.error ? (
        <StepperContainer>
          <Alert severity="error">
            The origin or destination cities were not found!
          </Alert>
        </StepperContainer>
      ) : (
        <StepperContainer>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Container sx={containerCS}>
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6} alignItems='start' display='flex' flexDirection='column' gap='20px'>
                  <h1>Information</h1>
                  <p>Origin City: <span>{query.originCity}</span></p>
                  {query.intermediateCities && (<p>Intermediate City/Cities: <span>{query.intermediateCities}</span></p>)}
                  <p>Destination City: <span>{query.destinationCity}</span></p>
                  <p>Date of the trip: <span>{query.date}</span></p>
                  <p>Passengers: <span>{query.passengers}</span></p>
                  <h3>Total Distances: <span>{distances?.total} km</span></h3>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stepper orientation="horizontal">
                    {distances?.results?.map((cityDistance, index) => (
                      <Step key={`distance-${index}`}>
                        <StepLabelEl StepIconComponent={StepperIcon}>
                          <span>{cityDistance.name}</span>
                          {index !== 0 && (
                            <span className="distance">{`${cityDistance.distance?.toLocaleString()} KM`}</span>
                          )}
                        </StepLabelEl>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </Container>
          )}
        </StepperContainer>
      )
      }
    </ResultsWrapper >
  );
}
