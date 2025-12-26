FROM python:3.10-slim-bookworm

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# Setup user and group ids
ARG USER_ID=1000
ENV USER_ID=$USER_ID
ARG GROUP_ID=1000
ENV GROUP_ID=$GROUP_ID

# Add non-root user and give permissions to workdir
RUN groupadd --gid $GROUP_ID user && \
    adduser user --ingroup user --gecos '' --disabled-password --uid $USER_ID && \
    mkdir -p /usr/src/app && \
    chown -R user:user /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files first (for better caching)
COPY --chown=user:user pyproject.toml uv.lock ./

# Switch to non-root user
USER user

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy application code
COPY --chown=user:user ./project ./project

# Disables lag in stdout/stderr output
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set working directory to project
WORKDIR /usr/src/app/project

# Expose streamlit port
EXPOSE 8501

CMD ["uv", "run", "streamlit", "run", "app.py", "--server.address=0.0.0.0"]
